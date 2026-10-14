import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import settings

logger = logging.getLogger(__name__)


def generate_reset_password_html(user_name: str, reset_link: str) -> str:
    """
    Tạo nội dung HTML Email đặt lại mật khẩu chuẩn nhận diện AI Code Mentor,
    tương thích hiển thị tối ưu trên Gmail Web và Mobile.
    """
    clean_name = user_name or "bạn"
    return f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt lại mật khẩu - AI Code Mentor</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Container 580px -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: transparent;">
          
          <!-- 1. Header bo góc: Nền thương hiệu xanh lá/tím -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 22px 28px; border-radius: 16px 16px 0 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <div style="font-size: 19px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; line-height: 1.2;">
                      AI Code Mentor
                    </div>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.18); color: #ffffff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.3px;">
                      Nền tảng học tập số
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. Khung trắng bo góc bên dưới -->
          <tr>
            <td style="background-color: #ffffff; padding: 36px 32px 32px 32px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; border-top: none; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);">
              
              <!-- Tiêu đề đậm -->
              <h1 style="margin: 0 0 20px 0; font-size: 23px; font-weight: 700; color: #111827; letter-spacing: -0.3px;">
                Đặt lại mật khẩu
              </h1>

              <!-- Nội dung lời chào & hướng dẫn -->
              <p style="margin: 0 0 14px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                Xin chào <strong>{clean_name}</strong>,
              </p>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
                Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản <strong>AI Code Mentor</strong>.
              </p>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
                Nhấn vào nút bên dưới để tạo mật khẩu mới.
              </p>
              <p style="margin: 0 0 26px 0; font-size: 13px; color: #6b7280; line-height: 1.5; font-style: italic;">
                Liên kết chỉ có hiệu lực trong thời gian ngắn để bảo vệ tài khoản của bạn.
              </p>

              <!-- Nút bấm CTA bo góc nổi bật -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 32px 0;">
                <tr>
                  <td align="center">
                    <a href="{reset_link}" target="_blank" style="display: inline-block; background-color: #16a34a; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 8px; box-shadow: 0 3px 6px rgba(22, 163, 74, 0.25); text-align: center;">
                      Đặt lại mật khẩu
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Alternative direct link -->
              <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 12px 14px; margin-bottom: 24px;">
                <p style="margin: 0 0 6px 0; font-size: 11px; color: #6b7280; font-weight: 600;">
                  Hoặc sao chép đường dẫn này vào trình duyệt:
                </p>
                <a href="{reset_link}" target="_blank" style="font-size: 12px; color: #2563eb; word-break: break-all; text-decoration: underline; line-height: 1.4;">
                  {reset_link}
                </a>
              </div>

              <!-- Dòng chú thích nhỏ dưới cùng -->
              <div style="border-top: 1px solid #f3f4f6; padding-top: 18px; margin-top: 10px;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                  Nếu bạn không yêu cầu thao tác này, hãy bỏ qua email hoặc đổi mật khẩu ngay.
                </p>
              </div>

            </td>
          </tr>

          <!-- 3. Footer bên ngoài -->
          <tr>
            <td align="center" style="padding-top: 24px;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                © 2026 AI Code Mentor • Nền tảng học tập & trợ lý AI lập trình
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


def send_reset_password_email(email_to: str, user_name: str, reset_link: str) -> bool:
    """
    Gửi email đặt lại mật khẩu với template HTML chuẩn tới hòm thư Gmail của người dùng.
    Hỗ trợ kết nối SMTP có xác thực (ví dụ Gmail App Password).
    Nếu SMTP chưa cấu hình hoặc gặp lỗi kết nối, in link ra log console để dễ dàng kiểm thử.
    """
    html_content = generate_reset_password_html(user_name, reset_link)

    # In log chi tiết phục vụ kiểm thử / development
    logger.info("=" * 60)
    logger.info(f"[RESET PASSWORD EMAIL] To: {email_to}")
    logger.info(f"[RESET PASSWORD EMAIL] Reset Link: {reset_link}")
    logger.info("=" * 60)

    # Nếu chưa cấu hình SMTP user/password, log cảnh báo và hoàn thành
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(
            "[EMAIL SERVICE] SMTP_USER hoặc SMTP_PASSWORD chưa được cấu hình trong .env. "
            "Email chưa được gửi qua internet. Link đặt lại: %s",
            reset_link,
        )
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Đặt lại mật khẩu cho tài khoản AI Code Mentor"
        msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.SMTP_USER}>"
        msg["To"] = email_to

        # Plain text fallback
        plain_text = (
            f"Xin chào {user_name},\n\n"
            f"Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản AI Code Mentor.\n"
            f"Vui lòng truy cập đường dẫn sau để đặt mật khẩu mới:\n{reset_link}\n\n"
            f"Nếu bạn không yêu cầu thao tác này, hãy bỏ qua email này.\n"
        )
        msg.attach(MIMEText(plain_text, "plain", "utf-8"))
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15)
        if settings.SMTP_TLS:
            server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_USER, [email_to], msg.as_string())
        server.quit()

        logger.info("[EMAIL SERVICE] Đã gửi thành công email đặt lại mật khẩu tới %s", email_to)
        return True
    except Exception as exc:
        logger.error("[EMAIL SERVICE] Lỗi khi gửi email qua SMTP: %s", exc)
        return False
