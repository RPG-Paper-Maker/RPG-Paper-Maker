/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef TROOPSDATAS_H
#define TROOPSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS TroopsDatas
//
//  Contains all the possible troops of a game. The data file is located in
//  Content/Datas/troops.json.
//
// -------------------------------------------------------

class TroopsDatas : public Serializable
{
public:
    TroopsDatas();
    virtual ~TroopsDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault(QStandardItem *modelMonsters);
    void setDefaultTranslations();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // TROOPSDATAS_H
