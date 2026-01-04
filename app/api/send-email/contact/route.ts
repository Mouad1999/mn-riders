import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string
    const lang = formData.get("lang") as string

    const image = formData.get("image") as File | null

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    let attachment = null

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer())
      attachment = {
        filename: image.name,
        content: buffer,
      }
    }

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
      from: `"MN RIDERS Website" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `📩 Contact – ${subject || "No subject"}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "-"}</p>
        <p><b>Address:</b> ${address || "-"}</p>
        <hr/>
        <p>${message}</p>
      `,
      attachments: attachment ? [attachment] : [],
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
