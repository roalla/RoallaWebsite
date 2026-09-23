"""Branded Focus Circle worksheets for public/workshops/focus-circle."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    Flowable,
)

try:
    import segno
except ImportError:
    segno = None

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "workshops" / "focus-circle"
PUBLIC.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#07111f")
BRAND = colors.HexColor("#007a87")
CYAN = colors.HexColor("#00b4c5")
GOLD = colors.HexColor("#f5c518")
PAPER = colors.HexColor("#f4f7fb")
MUTED = colors.HexColor("#5b6b7c")
LINE = colors.HexColor("#d5dee8")

pdfmetrics.registerFont(TTFont("Roalla", r"C:\Windows\Fonts\segoeui.ttf"))
pdfmetrics.registerFont(TTFont("RoallaBold", r"C:\Windows\Fonts\segoeuib.ttf"))

styles = getSampleStyleSheet()
kicker = ParagraphStyle("Kicker", fontName="RoallaBold", fontSize=9, leading=12, textColor=BRAND, tracking=1.2, spaceAfter=6)
title = ParagraphStyle("TitleR", fontName="RoallaBold", fontSize=22, leading=26, textColor=INK, spaceAfter=8)
body = ParagraphStyle("BodyR", fontName="Roalla", fontSize=10.5, leading=15, textColor=colors.HexColor("#1e293b"), spaceAfter=6)
small = ParagraphStyle("SmallR", fontName="Roalla", fontSize=8.5, leading=12, textColor=MUTED)
section = ParagraphStyle("SectionR", fontName="RoallaBold", fontSize=13, leading=16, textColor=INK, spaceBefore=8, spaceAfter=4)
center = ParagraphStyle("CenterR", parent=body, alignment=TA_CENTER)


class Rule(Flowable):
    def __init__(self):
        super().__init__()
        self.height = 8

    def wrap(self, aw, ah):
        self.width = aw
        return aw, self.height

    def draw(self):
        self.canv.setStrokeColor(CYAN)
        self.canv.setLineWidth(2)
        self.canv.line(0, 4, 72, 4)


class WriteLine(Flowable):
    def __init__(self, height=0.55 * inch):
        super().__init__()
        self.box_height = height

    def wrap(self, aw, ah):
        self.width = aw
        return aw, self.box_height

    def draw(self):
        self.canv.setStrokeColor(LINE)
        self.canv.setFillColor(colors.white)
        self.canv.roundRect(0, 2, self.width, self.box_height - 4, 4, stroke=1, fill=1)


def header_footer(canvas, doc, locale_label, url):
    canvas.saveState()
    canvas.setFillColor(INK)
    canvas.rect(0, letter[1] - 36, letter[0], 36, stroke=0, fill=1)
    canvas.setFillColor(GOLD)
    canvas.rect(0, letter[1] - 40, letter[0], 4, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont("RoallaBold", 9)
    canvas.drawString(0.7 * inch, letter[1] - 24, "ROALLA")
    canvas.setFont("Roalla", 9)
    canvas.drawRightString(letter[0] - 0.7 * inch, letter[1] - 24, locale_label)
    canvas.setFillColor(MUTED)
    canvas.setFont("Roalla", 8)
    canvas.drawString(0.7 * inch, 0.45 * inch, url)
    canvas.drawRightString(letter[0] - 0.7 * inch, 0.45 * inch, str(doc.page))
    canvas.restoreState()


def story_for(copy):
    story = [
        Paragraph(copy["kicker"], kicker),
        Paragraph(copy["title"], title),
        Rule(),
        Spacer(1, 8),
        Paragraph(copy["intro"], body),
    ]
    for block in copy["blocks"]:
        story.append(Paragraph(block["heading"], section))
        if block.get("text"):
            story.append(Paragraph(block["text"], body))
        for item in block.get("items", []):
            story.append(Paragraph(f"• {item}", body))
        for _ in range(block.get("lines", 0)):
            story.append(Spacer(1, 4))
            story.append(WriteLine(block.get("lineHeight", 0.48 * inch)))
        if block.get("columns"):
            cells = []
            for column in block["columns"]:
                inner = [Paragraph(column, section)]
                inner.append(Spacer(1, 6))
                inner.append(WriteLine(2.3 * inch))
                cells.append(inner)
            table = Table([cells], colWidths=[2.2 * inch, 2.2 * inch, 2.2 * inch])
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), PAPER),
                        ("BOX", (0, 0), (-1, -1), 0.4, LINE),
                        ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
                        ("LEFTPADDING", (0, 0), (-1, -1), 8),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                        ("TOPPADDING", (0, 0), (-1, -1), 8),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ]
                )
            )
            story.append(Spacer(1, 6))
            story.append(table)
    story.append(Spacer(1, 12))
    story.append(Paragraph(copy["footer"], small))
    return story


def build(locale, filename, copy, url):
    path = PUBLIC / f"{filename}-{locale}.pdf"
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.7 * inch,
        title=copy["title"],
        author="ROALLA",
    )
    label = "Focus Circle" if locale == "en" else "Cercle de concentration"
    doc.build(story_for(copy), onFirstPage=lambda c, d: header_footer(c, d, label, url), onLaterPages=lambda c, d: header_footer(c, d, label, url))
    print(path)


EN_URL = "roalla.com/en/programs/workshops/focus-circle"
FR_URL = "roalla.com/fr/programs/workshops/focus-circle"

CHECKLIST = {
    "en": {
        "kicker": "FOCUS CIRCLE",
        "title": "Weekly focus checklist",
        "intro": "A short reset before the week fills itself. Check a box only after you have done the thing.",
        "footer": "Educational workshop tool. Not therapy and not a productivity certification.",
        "blocks": [
            {
                "heading": "Prepare",
                "items": [
                    "Write the one outcome that would make this week honest.",
                    "Cross out what is noise.",
                    "Leave the rest for Later.",
                ],
            },
            {
                "heading": "Transform",
                "items": [
                    "Now holds one card.",
                    "The queue lives in Next.",
                    "One protected block is on the calendar.",
                    "Open loops are captured before they interrupt.",
                    "A shutdown notes where you stopped.",
                ],
            },
            {
                "heading": "Emerge",
                "items": [
                    "One person can see the plan.",
                    "The help you want is named.",
                    "Taking over is named too.",
                ],
            },
            {
                "heading": "Soar",
                "items": [
                    "One board review is on the calendar.",
                    "One next step is small enough for seven days.",
                ],
            },
        ],
    },
    "fr": {
        "kicker": "CERCLE DE CONCENTRATION",
        "title": "Liste de concentration hebdomadaire",
        "intro": "Une courte remise à zéro avant que la semaine se remplisse. Cochez seulement après avoir fait la chose.",
        "footer": "Outil d’atelier éducatif. Ni thérapie ni certification en productivité.",
        "blocks": [
            {
                "heading": "Préparer",
                "items": [
                    "Écrire le résultat qui rendrait cette semaine honnête.",
                    "Rayer le bruit.",
                    "Laisser le reste pour Plus tard.",
                ],
            },
            {
                "heading": "Transformer",
                "items": [
                    "Maintenant ne tient qu’une carte.",
                    "La file vit dans Ensuite.",
                    "Un bloc protégé est au calendrier.",
                    "Les boucles ouvertes sont notées avant d’interrompre.",
                    "Une clôture indique où vous vous êtes arrêté.",
                ],
            },
            {
                "heading": "Émerger",
                "items": [
                    "Une personne peut voir le plan.",
                    "L’aide voulue est nommée.",
                    "La prise de contrôle l’est aussi.",
                ],
            },
            {
                "heading": "S’élever",
                "items": [
                    "Une revue du tableau est au calendrier.",
                    "Une prochaine étape tient dans sept jours.",
                ],
            },
        ],
    },
}

KANBAN = {
    "en": {
        "kicker": "FOCUS CIRCLE",
        "title": "Kanban starter",
        "intro": "Now holds one card. Next is the queue. Later is allowed to wait. Do not write passwords or account numbers here.",
        "footer": "If everything is Now, nothing is.",
        "blocks": [
            {
                "heading": "The board",
                "columns": ["Now", "Next", "Later"],
            },
            {
                "heading": "Focus tools",
                "items": [
                    "One protected block:",
                    "One open loop captured:",
                    "One shutdown:",
                ],
                "lines": 3,
            },
        ],
    },
    "fr": {
        "kicker": "CERCLE DE CONCENTRATION",
        "title": "Kanban de départ",
        "intro": "Maintenant ne tient qu’une carte. Ensuite est la file. Plus tard a le droit d’attendre. N’écrivez pas de mots de passe ni de numéros de compte.",
        "footer": "Si tout est Maintenant, rien ne l’est.",
        "blocks": [
            {
                "heading": "Le tableau",
                "columns": ["Maintenant", "Ensuite", "Plus tard"],
            },
            {
                "heading": "Outils de concentration",
                "items": [
                    "Un bloc protégé :",
                    "Une boucle ouverte capturée :",
                    "Une clôture :",
                ],
                "lines": 3,
            },
        ],
    },
}

SUPPORT = {
    "en": {
        "kicker": "FOCUS CIRCLE",
        "title": "Support-circle card",
        "intro": "Show this to the person who will help. Support is welcome. Taking over is a different thing.",
        "footer": "Keep the decision with you.",
        "blocks": [
            {"heading": "Who I will tell", "lines": 1, "lineHeight": 0.7 * inch},
            {"heading": "The help I want", "lines": 2},
            {"heading": "The help I do not want", "lines": 2},
            {"heading": "The sentence I can say", "lines": 2},
        ],
    },
    "fr": {
        "kicker": "CERCLE DE CONCENTRATION",
        "title": "Carte du cercle de soutien",
        "intro": "Montrez ceci à la personne qui aidera. Le soutien est bienvenu. La prise de contrôle est autre chose.",
        "footer": "Gardez la décision.",
        "blocks": [
            {"heading": "Qui je vais prévenir", "lines": 1, "lineHeight": 0.7 * inch},
            {"heading": "L’aide que je veux", "lines": 2},
            {"heading": "L’aide que je ne veux pas", "lines": 2},
            {"heading": "La phrase que je peux dire", "lines": 2},
        ],
    },
}

PLAN = {
    "en": {
        "kicker": "FOCUS CIRCLE",
        "title": "Action plan",
        "intro": "Three commitments for the next seven days. The filled plan on the workshop page can also be printed from your browser.",
        "footer": "roalla.com/programs/workshops/focus-circle",
        "blocks": [
            {"heading": "One priority", "text": "The outcome that would make this week honest.", "lines": 2},
            {"heading": "One board change", "text": "The card that belongs in Now, and what moves to Later.", "lines": 2},
            {"heading": "One person to tell", "text": "Who should see the plan, and what help you want.", "lines": 2},
        ],
    },
    "fr": {
        "kicker": "CERCLE DE CONCENTRATION",
        "title": "Plan d’action",
        "intro": "Trois engagements pour les sept prochains jours. Le plan rempli sur la page de l’atelier peut aussi s’imprimer depuis le navigateur.",
        "footer": "roalla.com/programs/workshops/focus-circle",
        "blocks": [
            {"heading": "Une priorité", "text": "Le résultat qui rendrait cette semaine honnête.", "lines": 2},
            {"heading": "Un changement au tableau", "text": "La carte qui va dans Maintenant, et ce qui passe à Plus tard.", "lines": 2},
            {"heading": "Une personne à prévenir", "text": "Qui doit voir le plan, et quelle aide vous voulez.", "lines": 2},
        ],
    },
}


def toolkit_story(parts):
    story = []
    for index, part in enumerate(parts):
        if index:
            story.append(PageBreak())
        story.extend(story_for(part))
    return story


def build_toolkit(locale, parts, url):
    path = PUBLIC / f"toolkit-{locale}.pdf"
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.7 * inch,
        title="Focus Circle toolkit" if locale == "en" else "Trousse Cercle de concentration",
        author="ROALLA",
    )
    label = "Focus Circle" if locale == "en" else "Cercle de concentration"
    doc.build(
        toolkit_story(parts),
        onFirstPage=lambda c, d: header_footer(c, d, label, url),
        onLaterPages=lambda c, d: header_footer(c, d, label, url),
    )
    print(path)


def write_qr():
    if segno is None:
        raise SystemExit("segno is required to write QR codes")
    targets = {
        "en": "https://www.roalla.com/en/programs/workshops/focus-circle",
        "fr": "https://www.roalla.com/fr/programs/workshops/focus-circle",
    }
    for locale, url in targets.items():
        qr = segno.make(url, error="m")
        dest = PUBLIC / f"qr-{locale}.svg"
        qr.save(dest, scale=6, border=2, dark="#07111f")
        print(dest)


def main():
    pairs = [
        ("weekly-focus-checklist", CHECKLIST),
        ("kanban-starter", KANBAN),
        ("support-circle-card", SUPPORT),
        ("action-plan", PLAN),
    ]
    for locale, url in (("en", EN_URL), ("fr", FR_URL)):
        for filename, pack in pairs:
            build(locale, filename, pack[locale], url)
        build_toolkit(locale, [pack[locale] for _, pack in pairs], url)
    write_qr()


if __name__ == "__main__":
    main()
