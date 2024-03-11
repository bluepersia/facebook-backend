import { Query } from "mongoose";

export default class APIFeatures
{
    constructor (public reqQuery:{[key:string]:any}, public query:Query<unknown,unknown>) {}


    filter () : void
    {
        let filter = {...this.reqQuery};
        ['search', 'sort', 'fields', 'page', 'limit'].forEach (el => delete filter[el]);

        let filterStr = JSON.stringify (filter);
        filterStr = filterStr.replace (/\b(lt|lte|gt|gte)\b/g, match => `$${match}`);

        filter = JSON.parse (filterStr);

        this.query.find (filter);
    }

    search () : void
    {
        const search = this.reqQuery.search;
        if (search)
        {
            const regExp = new RegExp (search);
            this.query.find ({ $or: [{firstName: regExp}, {lastName: regExp}, {name: regExp}, {title:regExp}]});
        }
    }


    sort () : void
    {
        this.query.sort (this.reqQuery.sort?.split (',').join(' ') || '-createdAt');
    }


    select () : void 
    {
        this.query.select (this.reqQuery.fields?.split (',').join(' ') || '-__v');
    }

    paginate () : void 
    {
        const page = this.reqQuery.page || 1;
        let limit = this.reqQuery.limit || 10;
        if (limit > 10)
            limit = 10;

        const skip = (page - 1) * limit;

        this.query.skip (skip).limit (limit);
    }


    all ()
    {
        this.filter ();
        this.search ();
        this.sort ();
        this.select ();
        this.paginate ();
    }


}