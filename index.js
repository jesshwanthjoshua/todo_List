import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: 'postgres',
  password: 'Family14!$',
  database: 'permalist',
  hostname: 'localhost',
  port: 5432
})

db.connect();

let items = [
  // { id: 1, title: "Buy milk" },
  // { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  console.log(result.rows);
  items = result.rows;

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  console.log(req.body);
  const item = req.body.newItem;
  console.log(item);
  
  const result = db.query ("INSERT INTO items(title) VALUES ($1) RETURNING *",[item]);
  console.log(result);

  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  console.log(req.body);
  const id = req.body.updatedItemId;
  const item = req.body.updatedItemTitle;
  console.log(id, item);
  const result = await db.query("UPDATE items SET title = ($1) WHERE id = ($2) RETURNING *", [item, id]);
  console.log(result.rows);

  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  console.log(req.body);
  const id = req.body.deleteItemId;
  const result = await db.query("DELETE FROM items WHERE id = ($1) RETURNING *",[id]);
  console.log(result.rows);

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
