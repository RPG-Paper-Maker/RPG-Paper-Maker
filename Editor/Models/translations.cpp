/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "translations.h"
#include "rpm.h"
#include "common.h"

const QString Translations::JSON_NAMES = "names";
const QString Translations::JSON_SHORT = "short";
const QString Translations::JSON_TRANSLATIONS = "translations";
const QString Translations::OK = "ok";
const QString Translations::CANCEL = "cancel";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Translations::Translations() :
    m_currentLanguage("eng") // Put english language by default
{

}

Translations::~Translations()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Translations::read() {
    // Define all existing languages
    this->readLanguages();

    // Read translations for current language only
    this->readTranslations();
}

// -------------------------------------------------------

void Translations::readLanguages() {
    QJsonDocument doc;
    QJsonObject obj;
    QJsonArray tab;
    int i, l;

    Common::readOtherJSON(RPM::PATH_TRANSLATIONS_LANGUAGES, doc);
    obj = doc.object();
    tab = obj[JSON_NAMES].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        m_languagesNames << tab.at(i).toString();
    }
    tab = obj[JSON_SHORT].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        m_languagesShort << tab.at(i).toString();
    }
}

// -------------------------------------------------------

void Translations::readTranslations() {
    QJsonDocument doc;
    QJsonObject obj;
    QStringList keys;
    QString key;
    int i, l;

    Common::readOtherJSON(Common::pathCombine(RPM::PATH_TRANSLATIONS,
        Translations::JSON_TRANSLATIONS + RPM::DASH + m_currentLanguage + RPM
        ::EXTENSION_JSON), doc);
    obj = doc.object();
    keys = obj.keys();
    for (i = 0, l = keys.size(); i < l; i++) {
        key = keys.at(i);
        m_translations.insert(key, obj[key].toString());
    }
}

// -------------------------------------------------------

QString Translations::get(const QString &key) {
    return m_translations.value(key);
}
