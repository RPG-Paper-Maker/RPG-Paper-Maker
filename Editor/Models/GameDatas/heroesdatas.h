/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef HEROESDATA_H
#define HEROESDATA_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS HeroesDatas
//
//  Contains all the possible heroes of a game. The data file is located in
//  Content/Datas/heroes.json.
//
// -------------------------------------------------------

class HeroesDatas : public Serializable
{
public:
    HeroesDatas();
    virtual ~HeroesDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // DATAHEROES_H
