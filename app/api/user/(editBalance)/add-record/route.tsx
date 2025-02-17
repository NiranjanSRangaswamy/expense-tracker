import { getClient } from "@/lib/db";

export async function POST(request: Request) {
  const data = await request.json();
  console.log(data);
  const client = await getClient();

  const insertQuery =
    "insert into records (userid, transtype, category, subcategory, dates, times, balance, value, note, payer) values($1, $2, $3,$4,$5,$6,$7,$8,$9,$10) returning *";

  const updateQuery = "update usertable set balance = $1 where id = $2";

  const findLaterRecordsQuery =
    "select transid, balance from records where userid = $1 and (dates > $2 or (dates = $2 and times > $3)) order by dates, times;";

  const updateLaterRecordsQuery =
    "update records set balance = $1 where transid = $2;";

  try {
    await client.query("BEGIN");

    const insertRes = await client.query(insertQuery, [
      data.userId,
      data.transType,
      data.category,
      data.subCategory,
      data.date,
      data.time,
      data.balance,
      data.value,
      data.note,
      data.payer,
    ]);

    const newRecord = insertRes.rows[0];
    console.log(newRecord);

    const laterRecords = await client.query(findLaterRecordsQuery, [
      data.userId,
      data.date,
      data.time,
    ]);
    console.log(laterRecords);

    let adjustment = data.transType === "income" ? data.value : -data.value;

    for (const record of laterRecords.rows) {
      const updatedBalance = record.balance + adjustment;
      await client.query(updateLaterRecordsQuery, [updatedBalance, record.id]);
    }

    const finalBalance = laterRecords.rows.length
      ? laterRecords.rows[laterRecords.rows.length - 1].balance + adjustment
      : newRecord.balance;

    await client.query(updateQuery, [finalBalance, data.userId]);

    client.query("COMMIT");

    return new Response(
      JSON.stringify({
        message: "record is added to the database successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.log(error);
    client.query("ROLLBACK");
    return new Response(
      JSON.stringify({ message: "records is not added to the databese" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    client.release();
  }
}
