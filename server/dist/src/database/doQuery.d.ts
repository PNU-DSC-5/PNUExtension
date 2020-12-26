declare function doQuery<QueryResult = any>(query: string, queryArray?: any[]): Promise<{
    result: QueryResult;
    error: any;
}>;
export default doQuery;
