import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import fs from "fs"
import path from "path"
import n2words from "n2words"
import ExcelJS from "exceljs"


// ----------------------------------------
// Helpers
// ----------------------------------------
function loadImageBase64(filename: string) {
  const filePath = path.join(process.cwd(), "public", filename)
  return fs.readFileSync(filePath).toString("base64")
}

function amountToWords(amount: number) {
  const [i, d] = amount.toFixed(2).split(".")
  return (
    n2words(parseInt(i), { lang: "fr" }).toUpperCase() +
    " DIRHAMS ET " +
    n2words(parseInt(d), { lang: "fr" }).toUpperCase() +
    " CENTIMES"
  )
}

async function generateOrderExcel(orderNumber: string, items: any[]) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Commande")

  // Columns
  sheet.columns = [
    { header: "Commande", key: "order", width: 18 },
    { header: "Article", key: "name", width: 30 },
    { header: "Quantité", key: "qty", width: 15 },
    { header: "Prix Unitaire", key: "price", width: 18 },
    { header: "Total", key: "total", width: 18 },
  ]

  // Header style
  sheet.getRow(1).font = { bold: true }

  let totalGlobal = 0

  items.forEach(item => {
    const lineTotal = item.price * item.quantity
    totalGlobal += lineTotal

    sheet.addRow({
      order: orderNumber,
      name: item.name,
      qty: item.quantity,
      price: item.price,
      total: lineTotal,
    })
  })

  // Total row
  sheet.addRow({})
  const totalRow = sheet.addRow({
    name: "TOTAL",
    total: totalGlobal,
  })

  totalRow.font = { bold: true }

  return workbook.xlsx.writeBuffer()
}


// ----------------------------------------
// ROUTE
// ----------------------------------------
export async function POST(req: Request) {
  try {
    const {
      items,
      fullName,
      email,
      phone,
      address,
      remark,
    } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: "Cart empty" }, { status: 400 })
    }

    if (!fullName || !email || !phone || !address) {
      return NextResponse.json(
        { error: "Missing client info" },
        { status: 400 }
      )
    }



    const orderNumber = `CMD-${Date.now()}`
    const orderDate = new Date().toLocaleDateString("fr-FR")



    const total = items.reduce(
      (s: number, i: any) => s + i.price * i.quantity,
      0
    )

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body style="margin:0;padding:0;background:#000;">
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
    <td align="center"
      background="cid:bg"
      style="background-image:url('cid:bg');background-size:cover;background-position:center;padding:50px 0;">
    
    <table width="650" cellpadding="0" cellspacing="0"
      style="background:rgba(0,0,0,0.85);border-radius:22px;overflow:hidden;
      font-family:Arial,Helvetica,sans-serif;color:#ffffff;box-shadow:0 0 60px rgba(0,0,0,0.7);">
    
    <tr>
    <td style="padding:25px 35px;">
      <table width="100%">
        <tr>
          <td align="left">
            <img src="cid:logo" width="130" style="display:block;" />
          </td>
          <td align="right" style="color:#9cff57;font-size:14px;">
            ✔ Commande validée
          </td>
        </tr>
      </table>
    </td>
    </tr>
    
    <tr>
    <td align="center" style="padding:10px 20px 0;">
      <div style="
        font-size:64px;
        font-weight:900;
        letter-spacing:6px;
        color:#ffffff;
        text-transform:uppercase;
        text-shadow:
          0 0 6px #1e40af,
          0 0 14px #1e40af,
          2px 2px 0 #dc2626;">
        HOODIE
      </div>
    
      <div style="
        margin-top:-10px;
        font-size:18px;
        letter-spacing:3px;
        color:#9cff57;
        font-weight:600;">
        PREMIUM COLLECTION
      </div>
    </td>
    </tr>
    
    <tr>
    <td style="padding:30px 45px;font-size:16px;line-height:1.8;color:#f2f2f2;">
      <p>
        Merci pour votre commande 🔥  
        Vous venez de choisir un produit <strong>MN RIDERS</strong>,
        pensé pour ceux qui imposent leur style.
      </p>
    
      <p>
        Votre commande <strong>#${orderNumber}</strong> est bien enregistrée
        et sera préparée avec soin.
      </p>
    
      <p style="color:#9cff57;font-weight:bold;">
        ✔ Qualité premium<br/>
        ✔ Style urbain & puissant<br/>
        ✔ Conçu pour durer
      </p>
    
      <p>📎 Votre bon de commande est joint à cet email.</p>
    </td>
    </tr>
    
    <tr>
    <td style="padding:0 40px 20px;">
    <table width="100%" cellpadding="8" cellspacing="0"
    style="background:#0b1220;border-radius:14px;color:white;">
    <tr style="background:#1e293b;">
      <th align="left">Article</th>
      <th align="center">Qté</th>
      <th align="right">Total</th>
    </tr>
    
    ${items
      .map(
        (i: any) => `
        <tr>
          <td>${i.name}</td>
          <td align="center">${i.quantity}</td>
          <td align="right">${(i.price * i.quantity).toFixed(2)} €</td>
        </tr>
      `
      )
      .join("")}
    
    <tr>
    <td colspan="3" align="right"
    style="padding-top:12px;font-size:18px;color:#9cff57;font-weight:bold;">
    TOTAL : ${total.toFixed(2)} €
    </td>
    </tr>
    </table>
    </td>
    </tr>
    
    <tr>
    <td style="padding:25px 40px;color:#bbb;font-size:14px;">
    <p>
    Merci de faire partie de la famille <strong>MN RIDERS</strong> 🖤  
    Votre style. Votre énergie. Votre identité.
    </p>
    
    <p>
    📧 mnriiders@gmail.com<br/>
    📱 WhatsApp : 0636743640<br/>
    📸 Instagram : mn_riiders
    </p>
    </td>
    </tr>
    
    <tr>
    <td align="center"
    style="padding:15px;font-size:12px;color:#777;border-top:1px solid #222;">
    © ${new Date().getFullYear()} MN RIDERS — POWER • STYLE • IDENTITY
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>
    `

    // ----------------------------------------
    // LOAD ASSETS
    // ----------------------------------------
    const logo = loadImageBase64("logo.png")
    const background = loadImageBase64("background.png")
    const signature = loadImageBase64("sign.png")

    // ----------------------------------------
    // PDF
    // ----------------------------------------
    const doc = new jsPDF()

    const BLUE = [20, 40, 120]
    const RED = [220, 38, 38]

    // watermark
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()

    doc.setGState(new (doc as any).GState({ opacity: 0.08 }))
    doc.addImage(background, "PNG", (pageW - 160) / 2, (pageH - 160) / 2, 160, 160)
    doc.setGState(new (doc as any).GState({ opacity: 1 }))

    // HEADER
    doc.setFillColor(...BLUE)
    doc.rect(0, 0, 210, 25, "F")

    doc.setFillColor(...RED)
    doc.triangle(0, 0, 210, 0, 0, 14, "F")

    doc.addImage(logo, "PNG", 148, 4, 48, 30)

    doc.setFontSize(20)
    doc.setTextColor(255, 255, 255)
    doc.text("BON DE COMMANDE", 15, 22)

    doc.setFontSize(11)
    doc.text(`N° ${orderNumber}`, 15, 30)

    // ----------------------------------------
    // COMPANY INFO
    // ----------------------------------------
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)

    let y = 45
    doc.text("MN RIDERS", 15, y)
    y += 5
    doc.text("Instagram : mn_riiders", 15, y)
    y += 5
    doc.text("Facebook : MN RIDERS", 15, y)
    y += 5
    doc.text("WhatsApp : 0636743640", 15, y)
    y += 5
    doc.text("Adresse : hay oulfa alazhar", 15, y)
    y += 5
    doc.text("Email : mnriiders@gmail.com", 15, y)

    // ----------------------------------------
    // CLIENT INFO
    // ----------------------------------------
    y += 8
    doc.setFontSize(11)
    doc.setTextColor(...BLUE)
    doc.text("Client :", 15, y)

    y += 5
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text(fullName, 15, y)

    y += 5
    doc.text(`Téléphone : ${phone}`, 15, y)

    y += 5
    doc.text(`Email : ${email}`, 15, y)

    y += 5
    doc.text(`Adresse : ${address}`, 15, y)

    doc.text("Date :", 150, 50)
    doc.text(orderDate, 165, 50)

    // ----------------------------------------
    // TABLE
    // ----------------------------------------
    autoTable(doc, {
      startY: y + 10,
      head: [["Article", "Quantité", "Prix", "Total"]],
      body: items.map((i: any) => [
        i.name,
        i.quantity,
        `${i.price.toFixed(2)} €`,
        `${(i.price * i.quantity).toFixed(2)} €`,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: BLUE, textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    })

    // ----------------------------------------
    // TOTAL + REMARK + SIGNATURE
    // ----------------------------------------
    const finalY = (doc as any).lastAutoTable.finalY + 10

    doc.setFontSize(12)
    doc.setTextColor(...RED)
    doc.text(`TOTAL TTC : ${total.toFixed(2)} €`, 140, finalY)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text("Arrêté la présente commande à la somme de :", 15, finalY + 10)
    doc.text(amountToWords(total), 15, finalY + 15)

    if (remark) {
      doc.text("Remarque :", 15, finalY + 25)
      doc.text(remark, 15, finalY + 30)
    }

    doc.text("Signature :", 140, finalY + 28)
    doc.addImage(signature, "PNG", 140, finalY + 32, 40, 18)

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

    const excelBuffer = await generateOrderExcel(orderNumber, items)

    // ----------------------------------------
    // EMAIL (UNCHANGED BODY)
    // ----------------------------------------
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"MN RIDERS" <${process.env.SMTP_USER}>`,
      to: email,
      replyTo: "mnriiders@gmail.com",
      subject: `Bon de commande ${orderNumber}`,
      html: emailHtml,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(process.cwd(), "public/logo.png"),
          cid: "logo",
        },
        {
          filename: "backgroundemail.png",
          path: path.join(process.cwd(), "public/backgroundemail.png"),
          cid: "bg",
        },
        {
          filename: `Bon-de-commande-${orderNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    await transporter.sendMail({
      from: `"MN RIDERS" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // internal email
      subject: `🧾 Nouvelle commande ${orderNumber}`,
      html: `
        <h2>Nouvelle commande reçue</h2>
        <p><b>Commande :</b> ${orderNumber}</p>
        <p><b>Client :</b> ${fullName}</p>
        <p><b>Email :</b> ${email}</p>
        <p><b>Téléphone :</b> ${phone}</p>
        <p><b>Adresse :</b> ${address}</p>
        <br/>
        <p>📎 Le fichier Excel contient le détail de la commande.</p>
      `,
      attachments: [
        {
          filename: `Commande-${orderNumber}.xlsx`,
          content: excelBuffer,
        },
      ],
    })
    
    

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
