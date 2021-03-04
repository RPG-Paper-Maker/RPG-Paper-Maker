/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemfontname.h"
#include "rpm.h"

const QString SystemFontName::JSON_IS_BASIC = "isBasic";
const QString SystemFontName::JSON_FONT = "f";
const QString SystemFontName::JSON_CUSTOM_FONT_ID = "customFontID";
const bool SystemFontName::DEFAULT_IS_BASIC = true;
const QString SystemFontName::DEFAULT_FONT = "Arial";
const int SystemFontName::DEFAULT_CUSTOM_FONT_ID = 1;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemFontName::SystemFontName() :
    SystemFontName(-1, "")
{

}

SystemFontName::SystemFontName(int i, QString n, bool isBasic, PrimitiveValue
    *font, int customFontID) :
    SuperListItem(i, n),
    m_isBasic(isBasic),
    m_font(font),
    m_customFontID(customFontID)
{

}

SystemFontName::~SystemFontName()
{
    delete m_font;
}

bool SystemFontName::isBasic() const
{
    return m_isBasic;
}

void SystemFontName::setIsBasic(bool isBasic)
{
    m_isBasic = isBasic;
}

PrimitiveValue * SystemFontName::font() const
{
    return m_font;
}

int SystemFontName::customFontID() const
{
    return m_customFontID;
}

void SystemFontName::setCustomFontID(int customFontID)
{
    m_customFontID = customFontID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemFontName::getCSS() const
{
    return m_isBasic ? "" : reinterpret_cast<SystemFont *>(SuperListItem
        ::getById(RPM::get()->project()->fontsDatas()->model()
        ->invisibleRootItem(), m_customFontID))->getCSS(this->name());
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemFontName::openDialog()
{
    SystemFontName fontname;
    fontname.setCopy(*this);
    DialogSystemFontName dialog(fontname);
    if (dialog.exec() == QDialog::Accepted) {
        this->setCopy(fontname);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem * SystemFontName::createCopy() const
{
    SystemFontName *super = new SystemFontName;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemFontName::setCopy(const SuperListItem &super)
{
    const SystemFontName *fontname;
    SuperListItem::setCopy(super);
    fontname = reinterpret_cast<const SystemFontName *>(&super);
    m_isBasic = fontname->m_isBasic;
    m_font->setCopy(*fontname->m_font);
    m_customFontID = fontname->m_customFontID;
}

// -------------------------------------------------------

void SystemFontName::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    if (json.contains(JSON_IS_BASIC))
    {
        m_isBasic = json[JSON_IS_BASIC].toBool();
    }
    if (json.contains(JSON_FONT))
    {
        m_font->read(json[JSON_FONT].toObject());
    }
    if (json.contains(JSON_CUSTOM_FONT_ID))
    {
        m_customFontID = json[JSON_CUSTOM_FONT_ID].toInt();
    }
}

// -------------------------------------------------------

void SystemFontName::write(QJsonObject &json) const
{
    SuperListItem::write(json);
    if (m_isBasic != DEFAULT_IS_BASIC)
    {
        json[JSON_IS_BASIC] = m_isBasic;
    }
    if (m_isBasic)
    {
        if (m_font->kind() != PrimitiveValueKind::Message || m_font
            ->messageValue() != DEFAULT_FONT)
        {
            QJsonObject obj;
            m_font->write(obj);
            json[JSON_FONT] = obj;
        }
    } else
    {
        if (m_customFontID != DEFAULT_CUSTOM_FONT_ID)
        {
            json[JSON_CUSTOM_FONT_ID] = m_customFontID;
        }
    }
}
