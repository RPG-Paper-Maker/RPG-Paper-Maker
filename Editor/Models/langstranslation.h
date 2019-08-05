/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef LANGSTRANSLATION_H
#define LANGSTRANSLATION_H

#include <QHash>
#include <QVector>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS LangsTranslation
//
//  All the possible translations of something.
//
// -------------------------------------------------------

class LangsTranslation : public Serializable
{
public:
    LangsTranslation();
    LangsTranslation(QString name);
    LangsTranslation(QVector<int> ids, QVector<QString> names);
    virtual ~LangsTranslation();

    int mainID() const;
    QString mainName() const;
    void setMainName(QString n);
    QString defaultMainName() const;
    void setCopy(const LangsTranslation& super);
    void updateNames();
    void setAllNames(QString n);
    bool isEmpty() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<int, QString> m_names;
};

#endif // LANGSTRANSLATION_H
