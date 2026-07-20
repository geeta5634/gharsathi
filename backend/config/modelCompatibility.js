const { getStoreByName } = require('./memoryStore');

class NeDBModel {
  constructor(name) {
    this.name = name;
  }

  async update(filter, updateData) {
    const store = await getStoreByName(this.name);
    return store.update(filter, updateData);
  }

  async remove(filter) {
    const store = await getStoreByName(this.name);
    return store.remove(filter, { multi: true });
  }

  async find(filter = {}) {
    const store = await getStoreByName(this.name);
    return store.find(filter);
  }

  async findOne(filter = {}) {
    const store = await getStoreByName(this.name);
    return store.findOne(filter);
  }

  async findById(id) {
    const store = await getStoreByName(this.name);
    return store.findOne({ _id: id });
  }

  async create(data) {
    const store = await getStoreByName(this.name);
    const doc = { ...data, _id: data._id || require('crypto').randomUUID(), createdAt: new Date() };
    return store.insert(doc);
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const store = await getStoreByName(this.name);
    const doc = await store.findOne({ _id: id });
    if (!doc) return null;
    let updateData;
    if (update.$set) {
      updateData = { ...doc, ...update.$set };
    } else if (typeof update === 'object') {
      updateData = { ...doc, ...update };
    }
    if (options.new !== false) {
      await store.update({ _id: id }, { $set: updateData });
      return store.findOne({ _id: id });
    }
    return updateData;
  }

  async updateOne(filter, update) {
    const store = await getStoreByName(this.name);
    const doc = await store.findOne(filter);
    if (!doc) return { modifiedCount: 0 };
    const updateData = update.$set ? { ...doc, ...update.$set } : { ...doc, ...update };
    await store.update(filter, { $set: updateData });
    return { modifiedCount: 1 };
  }

  async findOneAndUpdate(filter, update, options = {}) {
    return this.findByIdAndUpdate(filter._id || filter, update, options);
  }

  async findByIdAndDelete(id) {
    const store = await getStoreByName(this.name);
    const doc = await store.findOne({ _id: id });
    if (doc) await store.remove({ _id: id });
    return doc;
  }

  async countDocuments(filter = {}) {
    const store = await getStoreByName(this.name);
    const docs = await store.find(filter);
    return docs.length;
  }

  async insertMany(docs) {
    const store = await getStoreByName(this.name);
    return store.insert(docs.map(d => ({ ...d, _id: d._id || require('crypto').randomUUID(), createdAt: new Date() })));
  }

  async deleteMany(filter = {}) {
    const store = await getStoreByName(this.name);
    return store.remove(filter, { multi: true });
  }

  async updateMany(filter, update) {
    const store = await getStoreByName(this.name);
    const docs = await store.find(filter);
    for (const doc of docs) {
      await store.update({ _id: doc._id }, { $set: update.$set || update });
    }
    return { modified: docs.length };
  }

  async aggregate(pipeline) {
    const store = await getStoreByName(this.name);
    const docs = await store.find({});
    let result = docs;
    for (const stage of pipeline) {
      if (stage.$match) {
        result = result.filter(d => Object.entries(stage.$match).every(([k, v]) => {
          if (typeof v === 'object' && v.$gte) return d[k] >= v.$gte;
          if (typeof v === 'object' && v.$lte) return d[k] <= v.$lte;
          if (typeof v === 'object' && v.$in) return v.$in.includes(d[k]);
          if (typeof v === 'object' && v.$ne) return d[k] !== v.$ne;
          if (typeof v === 'object' && v.$exists !== undefined) return v.$exists ? d[k] != null : d[k] == null;
          return d[k] === v;
        }));
      }
      if (stage.$group) {
        const grouped = {};
        for (const d of result) {
          const key = stage.$group._id ? (typeof stage.$group._id === 'string' ? d[stage.$group._id.replace('$', '')] : 'all') : 'all';
          if (!grouped[key]) grouped[key] = { _id: key };
          for (const [k, v] of Object.entries(stage.$group)) {
            if (k === '_id') continue;
            if (v.$sum) grouped[key][k] = (grouped[key][k] || 0) + (typeof v.$sum === 'number' ? v.$sum : (d[v.$sum.replace('$', '')] || 0));
            if (v.$avg) grouped[key][k] = (grouped[key][k] || 0) + (d[v.$avg.replace('$', '')] || 0);
          }
        }
        result = Object.values(grouped);
        for (const g of result) {
          for (const [k, v] of Object.entries(stage.$group)) {
            if (v.$avg && g[k]) g[k] = g[k] / result.length;
          }
        }
      }
      if (stage.$sort) {
        const [key, order] = Object.entries(stage.$sort)[0];
        result.sort((a, b) => (a[key] > b[key] ? 1 : -1) * order);
      }
      if (stage.$limit) {
        result = result.slice(0, stage.$limit);
      }
      if (stage.$lookup) {
        const fromStore = await getStoreByName(stage.$from);
        const fromDocs = await fromStore.find({});
        result = result.map(d => ({
          ...d,
          [stage.$as]: fromDocs.filter(f => {
            const localVal = d[stage.$localField];
            const foreignVal = f[stage.$foreignField];
            if (Array.isArray(localVal)) return localVal.includes(foreignVal);
            return localVal === foreignVal;
          })
        }));
      }
      if (stage.$unwind) {
        const field = stage.$unwind.replace('$', '');
        result = result.flatMap(d => {
          const arr = d[field] || [];
          if (arr.length === 0) return [];
          return arr.map(item => ({ ...d, [field]: item }));
        });
      }
      if (stage.$project) {
        result = result.map(d => {
          const projected = {};
          for (const [k, v] of Object.entries(stage.$project)) {
            if (v === 1) projected[k] = d[k];
            if (v === 0) continue;
            if (typeof v === 'string' && v.startsWith('$')) {
              projected[k] = d[v.replace('$', '')];
            }
          }
          return projected;
        });
      }
    }
    return result;
  }

  // Helper to populate references
  async populate(doc, paths) {
    if (!doc) return doc;
    if (Array.isArray(doc)) return Promise.all(doc.map(d => this.populate(d, paths)));
    if (!Array.isArray(paths)) paths = [paths];
    for (let p of paths) {
      if (typeof p === 'string') p = { path: p, select: '' };
      const refField = p.path;
      const refId = doc[refField];
      if (refId && typeof refId === 'string') {
        const refStore = await getStoreByName(refField === 'customer' ? 'users' : refField === 'worker' ? 'workers' : refField === 'service' ? 'services' : refField);
        const refDoc = await refStore.findOne({ _id: refId });
        if (refDoc) {
          if (p.select) {
            const selected = {};
            p.select.split(' ').forEach(s => { if (refDoc[s] !== undefined) selected[s] = refDoc[s]; });
            doc[refField] = selected;
          } else {
            const { password, ...rest } = refDoc;
            doc[refField] = rest;
          }
        }
      }
      if (p.path === 'worker' && p.populate) {
        if (doc.worker && doc.worker.user) {
          const userStore = await getStoreByName('users');
          const userDoc = await userStore.findOne({ _id: doc.worker.user });
          if (userDoc) {
            const { password, ...rest } = userDoc;
            doc.worker.user = rest;
          }
        }
      }
    }
    return doc;
  }

  // Sort by field
  sort(docs, sortObj) {
    if (!sortObj) return docs;
    const [key, order] = Object.entries(sortObj)[0];
    return docs.sort((a, b) => {
      if (a[key] > b[key]) return order;
      if (a[key] < b[key]) return -order;
      return 0;
    });
  }

  // Skip and limit
  skipLimit(docs, skip, limit) {
    let result = docs;
    if (skip) result = result.slice(skip);
    if (limit) result = result.slice(0, limit);
    return result;
  }

  select(doc, fields) {
    if (!doc || !fields) return doc;
    if (Array.isArray(doc)) return doc.map(d => this.select(d, fields));
    const selected = {};
    fields.split(' ').forEach(f => {
      if (f.startsWith('-')) return;
      if (doc[f] !== undefined) selected[f] = doc[f];
    });
    return selected;
  }
}

const models = {};
const modelNames = ['users', 'workers', 'services', 'bookings', 'memberships', 'reviews'];

modelNames.forEach(name => {
  models[name] = new NeDBModel(name);
});

module.exports = models;
