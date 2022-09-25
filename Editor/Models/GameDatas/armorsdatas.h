/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef ARMORSDATAS_H
#define ARMORSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS ArmorsDatas
//
//  Contains all the possible armors of a game. The data file is located in
//  Content/Datas/armors.json.
//
// -------------------------------------------------------

class ArmorsDatas : public Serializable
{
public:
    ArmorsDatas();
    virtual ~ArmorsDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault();
    void setDefaultTranslations();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // ARMORSDATAS_H
