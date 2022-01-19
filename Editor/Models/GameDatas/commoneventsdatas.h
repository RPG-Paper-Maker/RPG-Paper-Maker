/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef COMMONEVENTSDATAS_H
#define COMMONEVENTSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemcreateparameter.h"
#include "systemstate.h"

// -------------------------------------------------------
//
//  CLASS CommonEventsDatas
//
//  Contains all the common events. The data file is located in
//  Content/Datas/commonEvents.json.
//
// -------------------------------------------------------

class CommonEventsDatas : public Serializable
{
public:
    CommonEventsDatas();
    virtual ~CommonEventsDatas();
    QStandardItemModel * modelEventsSystem() const;
    QStandardItemModel * modelEventsUser() const;
    QStandardItemModel * modelStates() const;
    QStandardItemModel * modelCommonReactors() const;
    QStandardItemModel * modelCommonObjects() const;

    void read(QString path);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel *m_modelEventsSystem;
    QStandardItemModel *m_modelEventsUser;
    QStandardItemModel *m_modelStates;
    QStandardItemModel *m_modelCommonReactors;
    QStandardItemModel *m_modelCommonObjects;
};

#endif // COMMONEVENTSDATAS_H
