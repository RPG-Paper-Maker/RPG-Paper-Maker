/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef TRANSLATIONS_H
#define TRANSLATIONS_H

#include <QStringList>
#include <QHash>

// -------------------------------------------------------
//
//  CLASS Translations
//
//  All the software translations according to "Content/translations" folder.
//
// -------------------------------------------------------

class Translations
{
public:
    static const QString JSON_NAMES;
    static const QString JSON_SHORT;
    static const QString JSON_TRANSLATIONS;
    static const QString OK;
    static const QString CANCEL;

    Translations();
    virtual ~Translations();

    void read();
    void readLanguages();
    void readTranslations();
    QString get(const QString &key);

protected:
    QString m_currentLanguage;
    QStringList m_languagesNames;
    QStringList m_languagesShort;
    QHash<QString, QString> m_translations;
};

#endif // TRANSLATIONS_H
