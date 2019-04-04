/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
