import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  // mongoose Query Model
  public modelQuery: Query<T[], T>; // it means it might give array or array of object

  // express Query
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //  search method
  search(searchableFields: string[]) {
    if (this?.query?.searchTerm) {
      // const searchQuery = Student.find({
      //     $or: studentSearchableFields.map((field) => ({
      //       [field]: { $regex: searchTerm, $options: 'i' },
      //     })),
      //   });

      //   re assigning this.modelQuery
      // modelQuery replace hoye hoye jabe
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    // this helps to method chaining
    return this;
  }

  //   filter method

  filter() {
    const queryObj = { ...this.query };

    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }
}
