/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    void read(QString path);
    QStandardItemModel* modelEventsSystem() const;
    QStandardItemModel* modelEventsUser() const;
    QStandardItemModel* modelStates() const;
    QStandardItemModel* modelCommonReactors() const;
    QStandardItemModel* modelCommonObjects() const;
    void setDefault();
    void setDefaultEvent(QStandardItemModel* model, QStringList &namesEvents,
                         QList<QVector<SystemCreateParameter*>> &parameters);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_modelEventsSystem;
    QStandardItemModel* m_modelEventsUser;
    QStandardItemModel* m_modelStates;
    QStandardItemModel* m_modelCommonReactors;
    QStandardItemModel* m_modelCommonObjects;
};

#endif // COMMONEVENTSDATAS_H
