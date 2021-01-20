/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemfontname.h"

const QString SystemFontName::JSON_FONT = "f";
const QString SystemFontName::DEFAULT_FONT = "Arial";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemFontName::SystemFontName() :
    SystemFontName(-1, "", new PrimitiveValue(DEFAULT_FONT))
{

}

SystemFontName::SystemFontName(int i, QString n, PrimitiveValue *f) :
    SuperListItem(i, n),
    m_font(f)
{

}

SystemFontName::~SystemFontName() {
    delete m_font;
}

PrimitiveValue * SystemFontName::font() const {
    return m_font;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemFontName::openDialog() {
    SystemFontName fontname;
    fontname.setCopy(*this);
    DialogSystemFontName dialog(fontname);

    if (dialog.exec() == QDialog::Accepted) {
        setCopy(fontname);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem * SystemFontName::createCopy() const {
    SystemFontName *super = new SystemFontName;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemFontName::setCopy(const SuperListItem &super) {
    const SystemFontName *fontname;

    SuperListItem::setCopy(super);

    fontname = reinterpret_cast<const SystemFontName *>(&super);
    m_font->setCopy(*fontname->m_font);
}

// -------------------------------------------------------

void SystemFontName::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_FONT)) {
        m_font->read(json[JSON_FONT].toObject());
    }
}

// -------------------------------------------------------

void SystemFontName::write(QJsonObject &json) const {
    QJsonObject obj;

    SuperListItem::write(json);

    if (m_font->kind() != PrimitiveValueKind::Message || m_font->messageValue()
        != DEFAULT_FONT)
    {
        obj = QJsonObject();
        m_font->write(obj);
        json[JSON_FONT] = obj;
    }
}
