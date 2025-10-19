import { Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //partial search method
  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm;

    if (searchTerm) {
      /*
      When you use {} after the arrow, JavaScript treats it as a function body, not as an object literal.
      That means your function doesn’t return anything — so each item in the array becomes undefined.

      Wrapping the object in parentheses () tells JavaScript: “This is an object literal, not a block of code — return it implicitly.”
      */
      /*
      //model chaining
      this.modelQuery = this.modelQuery.find({
        //Implicitly returns object
        $or: searchableFields.map((field) => ({
          //read the notes below for understanding step by step
          [field]: { $regex: searchTerm, $options: 'i' }, // { email: { $regex: searchTerm, $options: 'i' } } //$options: 'i' (case insensitive)
        })),
      });
      */
      //model chaining
      this.modelQuery = this.modelQuery.find({
        //Explicitly returns object
        $or: searchableFields.map((field) => {
          //read the notes below for understanding step by step
          return { [field]: { $regex: searchTerm, $options: 'i' } }; // { email: { $regex: searchTerm, $options: 'i' } } //$options: 'i' (case insensitive)
        }),
      });
    }

    return this;
  }

  //filter method
  filter() {
    const queryObj = { ...this.query }; //copy
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj); //model chaining

    return this;
  }

  //sort method
  sort() {
    const sort =
      (this.query?.sort as string)?.split(',').join(' ') || 'createdAt';

    this.modelQuery = this.modelQuery.sort(sort); //model chaining

    return this;
  }

  //paginate method
  paginate() {
    //parseInt() → requires string, Number() → can take any/unknown without complaint.
    const limit = Number(this.query?.limit) || 10;
    const page = Number(this.query?.page) || 1;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit); //model chaining

    return this;
  }

  //fields limiting method
  fieldsLimiting() {
    //fields = 'name,email' (before)
    //fields = 'name email' (after)
    /*
    const fields = this.query?.fields
      ? (this.query.fields as string).split(',').join(' ')
      : '-__v';
    */
    const fields =
      (this.query?.fields as string)?.split(',').join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields); //model chaining

    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;

/*
const studentSearchableFields = [
  'email',
  'name.firstName',
  'name.lastName',
  'presentAddress',
  'permanentAddress',
  'guardian.name',
  'localGuardian.name',
];

const searchQuery = Student.find({
  $or: studentSearchableFields.map((field) => ({
    [field]: { $regex: searchTerm, $options: 'i' },
  })),
});


---------------------------------------------------------------

1. What does .map((field) => (...)) do here?

The .map() function takes each field name and returns an object like:  
{ [field]: { $regex: searchTerm, $options: 'i' } }

This produces an array of such objects, which is exactly what $or expects.

Example: if searchTerm = "dhaka" then result will be:

[
  { email: { $regex: "dhaka", $options: "i" } },
  { "name.firstName": { $regex: "dhaka", $options: "i" } },
  { "name.lastName": { $regex: "dhaka", $options: "i" } },
  { presentAddress: { $regex: "dhaka", $options: "i" } },
  { permanentAddress: { $regex: "dhaka", $options: "i" } },
  { "guardian.name": { $regex: "dhaka", $options: "i" } },
  { "localGuardian.name": { $regex: "dhaka", $options: "i" } }
]


---------------------------------------------------------------

2. What does $or do in MongoDB?

$or is a logical operator that checks if at least one condition is true.  
MongoDB will return documents where any of the given fields match.

Example query:

{
  $or: [
    { email: { $regex: "dhaka", $options: "i" } },
    { "name.firstName": { $regex: "dhaka", $options: "i" } },
    { presentAddress: { $regex: "dhaka", $options: "i" } }
  ]
}

This will return documents if any of those fields contains "dhaka".


---------------------------------------------------------------

3. What does $regex with $options: 'i' do?

- $regex → runs a regular expression (pattern match) instead of exact match.  
- $options: 'i' → makes the search case-insensitive.

So with { $regex: "dhaka", $options: "i" } the following will all match:  
- "dhaka"  
- "Dhaka"  
- "DHAKA"  
- "dHaKa city"


---------------------------------------------------------------

✅ Final Meaning

The original query becomes:

db.students.find({
  $or: [
    { email: { $regex: "dhaka", $options: "i" } },
    { "name.firstName": { $regex: "dhaka", $options: "i" } },
    { "name.lastName": { $regex: "dhaka", $options: "i" } },
    { presentAddress: { $regex: "dhaka", $options: "i" } },
    { permanentAddress: { $regex: "dhaka", $options: "i" } },
    { "guardian.name": { $regex: "dhaka", $options: "i" } },
    { "localGuardian.name": { $regex: "dhaka", $options: "i" } }
  ]
})

👉 Meaning:  
Find all students where any of those fields contains "dhaka" (case-insensitive).


---------------------------------------------------------------

Additional Notes:

- If the field is a string → regex applies directly.  
- If the field is an array of strings → MongoDB checks each element automatically.  
  Example: { tags: { $regex: "math" } } matches { tags: ["science", "math", "english"] }.  
- If the field is an array of objects → use dot notation (e.g. "name.firstName").  
- Regex will not work for numbers, nested arrays, or null values.


---------------------------------------------------------------

Equality vs Regex:

- Normal equality ({ name: "dhaka" }) → matches only if the value is exactly "dhaka".  
  - ❌ "Dhaka" won’t match  
  - ❌ "dhaka city" won’t match  

- Regex ({ name: { $regex: "dhaka" } }) → matches if the value contains "dhaka".  
  - ✅ "dhaka"  
  - ✅ "dhaka city"  
  - ✅ "north dhaka"  
  - ❌ "Dhaka" (unless you add $options: "i")  

- Case-insensitive Regex ($options: "i") → ignores case.  
  - ✅ "Dhaka"  
  - ✅ "DHAKA"  
  - ✅ "dHaKa city"

- Anchors in regex:  
  - ^dhaka → must start with "dhaka"  
  - dhaka$ → must end with "dhaka"


---------------------------------------------------------------

✅ In short:

- MongoDB equality → exact match only.  
- $regex → flexible search (contains, starts-with, ends-with).  
- $options: "i" → case-insensitive.  
- .map() → builds query objects for each field.  
- $or → returns if any field matches.
*/
