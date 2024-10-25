const express = require('express');
const cors = require('cors');
const mysql=require('mysql2');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid');
app.use(cors()); // Enable CORS

// Define a port
const PORT = 3000;
require('dotenv').config();

const db=mysql.createConnection({
  host:process.env.DBhost ,
  user:  process.env.User,
  password:process.env.Password,
  database: process.env.SQL_DATABASE1,
})

const db_userdata=mysql.createConnection({
  host:'localhost',
  user:  'root',
  password:  '',
  database:  process.env.SQL_DATABASE2,
})











app.post('/api/resetpassword', async (req, res) => {
  const { password, token, email } = req.body;

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);
console.log("password",hashedPassword)
console.log("token",token)
console.log("Email",email)
    // Update the password in the database
    const query = 'UPDATE userdetails SET password = ?, token=?  WHERE email = ? AND token = ?';
    db_userdata.query(query, [hashedPassword,null, email, token], (err, results) => {
      if (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ error: 'Internal server error' });
      } 
      else {
        if (results.affectedRows > 0) {
          console.log('Password updated successfully');
          // db.query("UPDATE `clientadmin` SET `Emailtoken`=? WHERE `Email`=?",['Empty',Email]);
          return res.json({ success: 'Password updated successfully' });
        }
         else {
          console.log('Email does not exist or token is invalid');
          return res.json({ error: 'Email does not exist or Link is expired' });
        }
      }
    });
  } catch (hashError) {
    console.error('Error hashing password:', hashError);
    return res.status(500).json({ error: 'Internal server error' });
  }
});













// Create a route to get user role
app.get('/api/get_UserRole', (req, res) => {
  // Replace this with your actual logic to get the user role
  db.query('SELECT * FROM `dropdown_user_role` WHERE 1',(error,result)=>{
    if(result)
    {
      res.json(result);
    }
    
  })
});


app.get('/api/forgotpassword', async (req, res) => {
  const email = req.query.email;
  const name = req.query.name;
  
  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  const resetToken = uuid.v4();

  db_userdata.query('UPDATE `userdetails` SET `token`= ? WHERE `email`=?', [resetToken, email], async (error, updateResult) => {
    if (updateResult) {
 const resetLink = process.env.CLEINT_URL + `/reset?token=${resetToken}`;
       // Setup Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., use your email provider
    auth: {
        user: 'sabarivesal@gmail.com', // your email
        pass: 'jfkr aoig jxgp oypq' // your email password or app password
    }
   });

// Email options
const mailOptions = {
    from: 'sabarivesal@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
          <p>Hello,${name}</p>
          <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
          <p>Click the following link to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If the link doesn't work, copy and paste it into your browser's address bar.</p>
          <p>Thank you!</p>
        `
      
};

try {
    await transporter.sendMail(mailOptions);
    console.log("send")
    res.json({ message: 'Reset email sent successfully' });
} catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
}


    }
    else {
      console.error('Error updating token in the database:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
})
 
});




app.put('/api/insert_user', async (req, res) => {
  const { name, email, role, emailverified, option, password } = req.body;
  console.log("API called insert", name, email, role, emailverified, option, password);

  try {
    // First, check if the email already exists in the database
    const checkQuery = 'SELECT * FROM `userdetails` WHERE `email` = ?';
    db_userdata.query(checkQuery, [email], async (err, result) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // If a user with the same email exists, send an error response
      if (result.length > 0) {
        return res.json({ message: 'Email already exists',loginoption:result[0].loginoption });
      }

      // If no duplicate, proceed to hash the password and insert the new user
      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 12);
      } else {
        hashedPassword = null;
      }

      const insertQuery = 'INSERT INTO `userdetails`(`name`, `email`, `role`, `emailverified`, `password`, `loginoption`) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [name, email, role, emailverified, hashedPassword, option];

      db_userdata.query(insertQuery, values, (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error inserting data:', insertErr);
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({ message: 'Data added successfully' });
      });
    });
  } catch (hashError) {
    console.error('Error hashing password:', hashError);
    return res.status(500).json({ error: 'Internal server error' });
  }
});






// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
