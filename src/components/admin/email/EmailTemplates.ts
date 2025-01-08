export const WELCOME_TEMPLATE = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez WearShop</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0; padding: 0; background-color: #f9f9f9;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <h1 style="color: #333; font-size: 24px; margin: 0;">Bienvenue chez WearShop</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; font-size: 16px; color: #555;">
                            <p>Cher client,</p>
                            <p>Merci de rejoindre la communauté WearShop ! Vous venez de faire le premier pas vers une expérience unique d'investissement dans le monde du luxe.</p>
                            <p>Votre compte est maintenant prêt, et vous pouvez dès aujourd'hui explorer nos opportunités d'investissement disponibles. Si vous avez des questions ou besoin d'aide, notre équipe se tient à votre disposition à tout moment.</p>
                            <p>Nous sommes ravis de vous accueillir parmi nous et avons hâte de vous accompagner dans vos premiers investissements.</p>
                            <p>À très bientôt,</p>
                            <p>L'équipe WearShop</p>
                            <p><a href="mailto:contact@wearshops.fr" style="color: #63c2f7; text-decoration: none;">contact@wearshops.fr</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

export const TEMPLATES = {
  empty: { subject: "", content: "" },
  welcome: {
    subject: "Bienvenue chez WearShop Invest",
    content: WELCOME_TEMPLATE,
  },
};