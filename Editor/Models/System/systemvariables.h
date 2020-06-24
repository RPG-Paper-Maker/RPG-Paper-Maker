/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMVARIABLES_H
#define SYSTEMVARIABLES_H

#include<QStandardItemModel>
#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemVariables
//
//  An object representing the variables and switches items.
//
// -------------------------------------------------------

class SystemVariables : public SuperListItem
{
public:
    SystemVariables();
    SystemVariables(int i, QString n);
    SystemVariables(int i, QString n, QStandardItemModel* m);
    virtual ~SystemVariables();
    static int variablesPerPage;
    QStandardItemModel* model() const;
    virtual QString idToString() const;
    SuperListItem* getById(int id) const;
    void setDefaultVariables(bool i);

    virtual void setDefault();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    void readCommand(const QJsonArray &json);
    virtual void write(QJsonObject &json) const;
    QJsonArray getArrayJSON() const;

private:
    QStandardItemModel* p_model;
};

Q_DECLARE_METATYPE(SystemVariables)

#endif // SYSTEMVARIABLES_H
