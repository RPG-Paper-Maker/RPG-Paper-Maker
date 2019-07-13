/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SKILLSDATAS_H
#define SKILLSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS SkillsDatas
//
//  Contains all the possible skills of a game. The data file is located in
//  Content/Datas/skills.json.
//
// -------------------------------------------------------

class SkillsDatas : public Serializable
{
public:
    SkillsDatas();
    virtual ~SkillsDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // SKILLSDATAS_H
