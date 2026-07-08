import { MongoClient, ObjectId, Db } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.DATABASE_URL || 'mongodb://RFID:fPEh8O63u5XgqHxn@rfidreaderapp-shard-00-00.c4fal.mongodb.net:27017,rfidreaderapp-shard-00-01.c4fal.mongodb.net:27017,rfidreaderapp-shard-00-02.c4fal.mongodb.net:27017/SanskarGurukul?ssl=true&authSource=admin&replicaSet=atlas-unkwii-shard-0';
const client = new MongoClient(url);
let dbInstance: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db();
    console.log('Connected to MongoDB via Native MongoClient successfully!');
  }
  return dbInstance;
}

function toMongoId(val: any): any {
  if (typeof val === 'string' && val.length === 24 && /^[0-9a-fA-F]+$/.test(val)) {
    return new ObjectId(val);
  }
  return val;
}

function mapDoc(doc: any): any {
  if (!doc) return doc;
  const newDoc = { ...doc };
  if (newDoc._id) {
    newDoc.id = newDoc._id.toString();
  }
  return newDoc;
}

class CollectionWrapper {
  collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async getColl() {
    const db = await connectToDatabase();
    return db.collection(this.collectionName);
  }

  parseWhere(where: any) {
    if (!where) return {};
    const query: any = {};
    for (const key of Object.keys(where)) {
      const val = where[key];
      if (key === 'id') {
        query['_id'] = toMongoId(val);
      } else if (typeof val === 'object' && val !== null) {
        const operators: any = {};
        let hasOp = false;
        if ('in' in val) {
          query[key] = { $in: val.in.map((item: any) => key === 'id' ? toMongoId(item) : item) };
          continue;
        }
        if ('equals' in val) {
          query[key] = val.equals;
          continue;
        }
        if ('gte' in val) {
          operators['$gte'] = val.gte;
          hasOp = true;
        }
        if ('lt' in val) {
          operators['$lt'] = val.lt;
          hasOp = true;
        }
        if ('lte' in val) {
          operators['$lte'] = val.lte;
          hasOp = true;
        }
        if ('gt' in val) {
          operators['$gt'] = val.gt;
          hasOp = true;
        }
        if ('not' in val) {
          operators['$ne'] = val.not;
          hasOp = true;
        }
        if (hasOp) {
          query[key] = operators;
        } else {
          query[key] = val;
        }
      } else {
        query[key] = val;
      }
    }
    return query;
  }

  async findUnique(args: any): Promise<any> {
    const coll = await this.getColl();
    const query = this.parseWhere(args?.where);
    let doc = await coll.findOne(query);
    if (!doc) return null as any;
    doc = mapDoc(doc);
    if (args?.include) {
      await this.handleIncludes([doc], args.include);
    }
    return doc as any;
  }

  async findFirst(args: any): Promise<any> {
    const coll = await this.getColl();
    const query = this.parseWhere(args?.where);
    let doc = await coll.findOne(query);
    if (!doc) return null as any;
    doc = mapDoc(doc);
    if (args?.include) {
      await this.handleIncludes([doc], args.include);
    }
    return doc as any;
  }

  async findMany(args: any = {}): Promise<any> {
    const coll = await this.getColl();
    const query = this.parseWhere(args?.where);
    let cursor = coll.find(query);

    if (args?.orderBy) {
      const sortObj: any = {};
      for (const k of Object.keys(args.orderBy)) {
        sortObj[k] = args.orderBy[k] === 'desc' ? -1 : 1;
      }
      cursor = cursor.sort(sortObj);
    }

    let docs = await cursor.toArray();
    docs = docs.map(mapDoc);
    if (args?.include) {
      await this.handleIncludes(docs, args.include);
    }
    return docs as any;
  }

  async create(args: any): Promise<any> {
    const coll = await this.getColl();
    const data = { ...args.data };

    if (!data.createdAt) data.createdAt = new Date();
    data.updatedAt = new Date();

    const relations = ['user', 'payments', 'student', 'attendances', 'inquiries', 'employee', 'assignedEmployee'];
    for (const r of relations) {
      delete data[r];
    }

    const result = await coll.insertOne(data);
    let doc = await coll.findOne({ _id: result.insertedId });
    doc = mapDoc(doc);
    if (args?.include) {
      await this.handleIncludes([doc], args.include);
    }
    return doc as any;
  }

  async update(args: any): Promise<any> {
    const coll = await this.getColl();
    const query = this.parseWhere(args.where);
    const data = { ...args.data };
    data.updatedAt = new Date();

    const relations = ['user', 'payments', 'student', 'attendances', 'inquiries', 'employee', 'assignedEmployee'];
    for (const r of relations) {
      delete data[r];
    }

    const updateObj: any = { $set: {} };
    const incObj: any = {};
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (typeof val === 'object' && val !== null && 'increment' in val) {
        incObj[key] = val.increment;
      } else {
        updateObj.$set[key] = val;
      }
    }
    if (Object.keys(incObj).length > 0) {
      updateObj.$inc = incObj;
    }
    if (Object.keys(updateObj.$set).length === 0) {
      delete updateObj.$set;
    }

    await coll.updateOne(query, updateObj);
    let doc = await coll.findOne(query);
    doc = mapDoc(doc);
    if (args?.include) {
      await this.handleIncludes([doc], args.include);
    }
    return doc as any;
  }

  async updateMany(args: any): Promise<any> {
    const coll = await this.getColl();
    const query = this.parseWhere(args.where);
    const data = { ...args.data };
    data.updatedAt = new Date();

    const relations = ['user', 'payments', 'student', 'attendances', 'inquiries', 'employee', 'assignedEmployee'];
    for (const r of relations) {
      delete data[r];
    }

    const result = await coll.updateMany(query, { $set: data });
    return { count: result.modifiedCount } as any;
  }

  async delete(args: any): Promise<any> {
    const coll = await this.getColl();
    const query = this.parseWhere(args.where);
    let doc = await coll.findOne(query);
    doc = mapDoc(doc);
    await coll.deleteOne(query);
    return doc as any;
  }

  async deleteMany(args: any = {}): Promise<any> {
    const coll = await this.getColl();
    const query = this.parseWhere(args.where);
    const result = await coll.deleteMany(query);
    return { count: result.deletedCount } as any;
  }

  async count(args: any = {}): Promise<any> {
    const coll = await this.getColl();
    const query = this.parseWhere(args?.where);
    return await coll.countDocuments(query) as any;
  }

  async handleIncludes(docs: any[], include: any) {
    if (!docs || docs.length === 0) return;
    const db = await connectToDatabase();

    if (include.payments) {
      const studentIds = docs.map(d => d.id);
      const paymentsColl = db.collection('Payment');
      const allPayments = await paymentsColl.find({ studentId: { $in: studentIds } }).toArray();
      const mappedPayments = allPayments.map(mapDoc);
      for (const doc of docs) {
        doc.payments = mappedPayments.filter(p => p.studentId === doc.id);
      }
    }

    if (include.student) {
      const studentIds = docs.map(d => d.studentId).filter(Boolean);
      const studentsColl = db.collection('Student');
      const allStudents = await studentsColl.find({ _id: { $in: studentIds.map(toMongoId) } }).toArray();
      const mappedStudents = allStudents.map(mapDoc);
      for (const doc of docs) {
        doc.student = mappedStudents.find(s => s.id === doc.studentId) || null;
      }
    }

    if (include.attendances) {
      const employeeIds = docs.map(d => d.id);
      const attendanceColl = db.collection('Attendance');
      const allAttendances = await attendanceColl.find({ employeeId: { $in: employeeIds } }).toArray();
      const mappedAttendances = allAttendances.map(mapDoc);
      for (const doc of docs) {
        doc.attendances = mappedAttendances.filter(a => a.employeeId === doc.id);
      }
    }

    if (include.inquiries) {
      const employeeIds = docs.map(d => d.id);
      const inquiriesColl = db.collection('AdmissionInquiry');
      const allInquiries = await inquiriesColl.find({ assignedEmployeeId: { $in: employeeIds } }).toArray();
      const mappedInquiries = allInquiries.map(mapDoc);
      for (const doc of docs) {
        doc.inquiries = mappedInquiries.filter(i => i.assignedEmployeeId === doc.id);
      }
    }

    if (include.assignedEmployee) {
      const employeeIds = docs.map(d => d.assignedEmployeeId).filter(Boolean);
      const usersColl = db.collection('User');
      const allEmployees = await usersColl.find({ _id: { $in: employeeIds.map(toMongoId) } }).toArray();
      const mappedEmployees = allEmployees.map(mapDoc);
      for (const doc of docs) {
        doc.assignedEmployee = mappedEmployees.find(e => e.id === doc.assignedEmployeeId) || null;
      }
    }

    if (include.employee) {
      const employeeIds = docs.map(d => d.employeeId).filter(Boolean);
      const usersColl = db.collection('User');
      const allEmployees = await usersColl.find({ _id: { $in: employeeIds.map(toMongoId) } }).toArray();
      const mappedEmployees = allEmployees.map(mapDoc);
      for (const doc of docs) {
        doc.employee = mappedEmployees.find(e => e.id === doc.employeeId) || null;
      }
    }
  }
}

class PrismaMockClient {
  user = new CollectionWrapper('User');
  student = new CollectionWrapper('Student');
  payment = new CollectionWrapper('Payment');
  admissionInquiry = new CollectionWrapper('AdmissionInquiry');
  attendance = new CollectionWrapper('Attendance');

  async $transaction(promises: Array<any>) {
    return Promise.all(promises);
  }

  async $disconnect() {
    await client.close();
    dbInstance = null;
  }
}

const prisma = new PrismaMockClient();
export default prisma;
