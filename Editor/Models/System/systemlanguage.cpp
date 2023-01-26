/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemlanguage.h"
#include "dialogsystemlanguage.h"

const QString SystemLanguage::JSON_KIND = "kind";
const QString SystemLanguage::DEFAULT_NAME = "English";
const LanguageKind SystemLanguage::DEFAULT_KIND = LanguageKind::English;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemLanguage::SystemLanguage(int i, QString name, LanguageKind kind) :
    SuperListItem(i, name),
    m_kind(kind)
{

}

SystemLanguage::~SystemLanguage()
{

}

LanguageKind SystemLanguage::kind() const
{
    return m_kind;
}

void SystemLanguage::setKind(LanguageKind kind)
{
    m_kind = kind;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemLanguage::openDialog()
{
    SystemLanguage language;
    language.setCopy(*this);
    DialogSystemLanguage dialog(language);
    if (dialog.exec() == QDialog::Accepted)
    {
        setCopy(language);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemLanguage::createCopy() const
{
    SystemLanguage *super = new SystemLanguage;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemLanguage::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);
    const SystemLanguage *language = reinterpret_cast<const SystemLanguage *>(&super);
    m_kind = language->m_kind;
}

// -------------------------------------------------------

void SystemLanguage::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    m_kind = static_cast<LanguageKind>(json[JSON_KIND].toInt());
}

// -------------------------------------------------------

void SystemLanguage::write(QJsonObject &json) const
{
    SuperListItem::write(json);
    json[JSON_KIND] = static_cast<int>(m_kind);
}
