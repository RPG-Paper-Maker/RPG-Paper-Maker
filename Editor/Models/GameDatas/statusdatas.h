/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef STATUSDATAS_H
#define STATUSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS StatusDatas
//
//  Contains all the possible status of a game. The data file is located in
//  Content/Datas/status.json.
//
// -------------------------------------------------------

class StatusDatas : public Serializable
{
public:
    static const QString JSON_STATUS;

    StatusDatas();
    virtual ~StatusDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // STATUSDATAS_H
