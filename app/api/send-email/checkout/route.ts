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
    const doc = new jsPDF("p", "mm", "a4")

    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()

    // Watermark
    doc.setGState(new (doc as any).GState({ opacity: 0.35 }))
    doc.addImage(background, "PNG", (pageW - 200) / 2, (pageH - 120) / 2, 200, 120)
    doc.setGState(new (doc as any).GState({ opacity: 2 }))

    // ===== HEADER (UPDATED DESIGN) =====
    doc.setFillColor(225, 232, 240) // light gray-blue
    doc.rect(0, 0, pageW, 36, "F")

    // Stripe 1 – Dark Blue
    doc.setFillColor(30, 58, 138)
    doc.triangle(0, 0, pageW * 0.55, 0, 0, 36, "F")

    // Stripe 2 – Gray Blue
    doc.setFillColor(120, 140, 180)
    doc.triangle(
      pageW * 0.15,
      0,
      pageW * 0.7,
      0,
      pageW * 0.15,
      36,
      "F"
    )

    // Stripe 3 – Soft Red
    doc.setFillColor(200, 60, 60)
    doc.triangle(
      pageW * 0.3,
      0,
      pageW * 0.85,
      0,
      pageW * 0.3,
      36,
      "F"
    )

    // Logo (no dark background behind it)
    doc.addImage(logo, "PNG", pageW - 60, 6, 40, 30)

    // Title
    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.setTextColor(0, 0, 0)
    doc.text("BON DE COMMANDE", 15, 22)

    // Order number
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text(`Commande N° ${orderNumber}`, 15, 30)

    // Date
    doc.setTextColor(110, 110, 110)
    doc.text(`Date : ${orderDate}`, pageW - 65, 42)

    // Section helper
    const section = (y: number, title: string) => {
      doc.setFillColor(245, 245, 245)
      doc.roundedRect(12, y, pageW - 24, 10, 3, 3, "F")
      doc.setTextColor(30, 58, 138)
      doc.setFontSize(11)
      doc.text(title, 16, y + 7)
    }

    let y = 50

    // Company
    section(y, "ENTREPRISE")
    y += 15
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text("MN RIDERS", 16, y)
    y += 5
    doc.text("Instagram : mn_riiders", 16, y)
    y += 5
    doc.text("Facebook : MN RIDERS", 16, y)
    y += 5
    doc.text("WhatsApp : 0636743640", 16, y)
    y += 5
    doc.text("Email : mnriiders@gmail.com", 16, y)

    // Client
    y += 8
    section(y, "CLIENT")
    y += 15
    doc.text(`Nom : ${fullName}`, 16, y)
    y += 5
    doc.text(`Téléphone : ${phone}`, 16, y)
    y += 5
    doc.text(`Email : ${email}`, 16, y)
    y += 5
    doc.text(`Adresse : ${address}`, 16, y)

    // Table
    y += 10
    autoTable(doc, {
      startY: y,
      head: [["Article", "Quantité", "Prix unitaire", "Total"]],
      body: items.map((i: any) => [
        i.name,
        i.quantity,
        `${i.price.toFixed(2)} MAD`,
        `${(i.price * i.quantity).toFixed(2)} MAD`,
      ]),
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      styles: { fontSize: 10 },
    })

    const finalY = (doc as any).lastAutoTable.finalY + 12

    // Total
    doc.setFillColor(200, 60, 60)
    doc.roundedRect(pageW - 85, finalY, 70, 18, 3, 3, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.text(`TOTAL : ${total.toFixed(2)} MAD`, pageW - 80, finalY + 12)

    // Amount in words
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.text("Arrêté la présente commande à la somme de :", 16, finalY + 25)
    doc.text(amountToWords(total), 16, finalY + 30)

    // Remark
    if (remark) {
      doc.setFont("helvetica", "bold")
      doc.text("Remarque :", 16, finalY + 40)
      doc.setFont("helvetica", "normal")
      doc.text(remark, 16, finalY + 45)
    }

    // Signature
    doc.setFont("helvetica", "bold")
    doc.text("Signature :", pageW - 80, finalY + 42)
    doc.addImage(signature, "PNG", pageW - 80, finalY + 46, 45, 18)

    // Footer
    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text(
      `© ${new Date().getFullYear()} MN RIDERS — POWER • STYLE • IDENTITY`,
      pageW / 2,
      pageH - 10,
      { align: "center" }
    )


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
