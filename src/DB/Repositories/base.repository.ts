import mongoose, {
  Model,
  PopulateOptions,
  QueryFilter,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';

export default abstract class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  createDocument(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  findOneDocument(filters: QueryFilter<T>, select = {}): Promise<T | null> {
    return this.model.findOne(filters).select(select);
  }

  findDocumentById(id: Types.ObjectId): Promise<T | null> {
    return this.model.findById(id);
  }

  findDocuments(filters: QueryFilter<T>, options?: QueryOptions): Promise<T[]> {
    const { limit, skip, populate, select, ...otherOptions } = options || {};
    const query = this.model.find(filters, otherOptions);
    if (limit && skip) {
      return query.limit(limit).skip(skip);
    }
    if (populate) query.populate(populate as PopulateOptions);
    if (select) query.select(select);
    return query;
  }

  updateWithFindById({
    id,
    data,
    options,
  }: {
    id: Types.ObjectId;
    data: UpdateQuery<T>;
    options?: QueryOptions;
  }) {
    return this.model.findByIdAndUpdate(id, data, {
      ...options,
      runValidators: true,
    });
  }

  deleteWithFindOne({
    filters,
  }: {
    filters: QueryFilter<T>;
  }): Promise<T | null> {
    return this.model.findOneAndDelete(filters);
  }

  deleteManyDocuments({
    filters,
    options = {},
  }: {
    filters: QueryFilter<T>;
    options?: mongoose.mongo.DeleteOptions;
  }): Promise<mongoose.mongo.DeleteResult> {
    const query = this.model.deleteMany(filters, options);
    return query;
  }

  deleteWithFindById(_id: Types.ObjectId) {
    const query = this.model.findByIdAndDelete(_id);
    return query;
  }
}
