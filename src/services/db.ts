import oracledb from "oracledb";
import * as settings from "../settings.json";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const ds = settings.DataSaource;

async function GetSchemaName(con: oracledb.Connection, branch: string) {
    const result = await con.execute("SELECT user_name FROM SS_DBLINK_BRANCH where branch = :p_branch", [branch]);
    if (result.rows && result.rows.length > 0)
        return String((result.rows[0] as any).USER_NAME);
    return "";
}

async function AlterSession(con: oracledb.Connection, branch: string) {
    const schemaName = await GetSchemaName(con, branch);
    await con.execute("ALTER SESSION SET CURRENT_SCHEMA = " + schemaName);
}

export async function GetConnection(userName: string, password: string, branch: string) {

    const result = await oracledb.getConnection({
        user: userName,
        password: password,
        connectionString: `${ds.server}:${ds.port}/${ds.database}`
    });

    await result.execute("ALTER SESSION SET NLS_DATE_FORMAT='DD.MM.YYYY'");
    await AlterSession(result, branch);

    return result;
}