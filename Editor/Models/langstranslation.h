/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef LANGSTRANSLATION_H
#define LANGSTRANSLATION_H

#include <QHash>
#include <QVector>
#include <QJsonObject>

// -------------------------------------------------------
//
//  CLASS LangsTranslation
//
//  All the possible translations of something.
//
// -------------------------------------------------------

class LangsTranslation
{
public:
    LangsTranslation();
    LangsTranslation(QString name);
    LangsTranslation(QVector<int> ids, QVector<QString> names);
    virtual ~LangsTranslation();
    int mainId() const;
    QString mainName() const;
    void setMainName(QString n);
    QString defaultMainName() const;
    void setCopy(const LangsTranslation& super);
    void updateNames();
    void setAllNames(QString n);
    bool isEmpty() const;

    void read(const QJsonObject &json);
    void write(QJsonObject &json) const;

protected:
    QHash<int, QString> m_names;
};

#endif // LANGSTRANSLATION_H
