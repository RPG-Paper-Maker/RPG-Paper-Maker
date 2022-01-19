/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "langsdatas.h"
#include "rpm.h"
#include "common.h"
#include "systemlanguage.h"

const QString LangsDatas::JSON_LANGS = "langs";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

LangsDatas::LangsDatas()
{
    m_model = new QStandardItemModel;
}

LangsDatas::~LangsDatas()
{
    SuperListItem::deleteModel(m_model);
}

QStandardItemModel * LangsDatas::model() const
{
    return m_model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int LangsDatas::mainLang() const
{
    return reinterpret_cast<SystemLanguage *>(m_model->item(0)->data().value<quintptr>())->id();
}

// -------------------------------------------------------

void LangsDatas::read(QString path)
{
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_LANGS), *this);
}

// -------------------------------------------------------

void LangsDatas::setDefault()
{
    SuperListItem::deleteModel(m_model, false);
    int index = RPM::get()->translations()->indexOfLanguagesShort(RPM::get()
        ->engineSettings()->currentLanguage());
    m_model->appendRow((new SystemLanguage(1, RPM::get()->translations()
        ->languagesNames().at(index), static_cast<LanguageKind>(index + 1)))
        ->getModelRow());
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void LangsDatas::read(const QJsonObject &json)
{
    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    SuperListItem::readTree(m_model, new SystemLanguage, json, JSON_LANGS);
}

// -------------------------------------------------------

void LangsDatas::write(QJsonObject &json) const
{
    SuperListItem::writeTree(m_model, json, JSON_LANGS);
}
