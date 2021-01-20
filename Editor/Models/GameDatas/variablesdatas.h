/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef VARIABLESDATAS_H
#define VARIABLESDATAS_H

#include "serializable.h"
#include <QStandardItemModel>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS VariablesDatas
//
//  Contains all the variables and switches. The variables are
//  a simple array of int, and the switches an array of booleans.
//
// -------------------------------------------------------

class VariablesDatas : public Serializable
{
public:
    VariablesDatas();
    virtual ~VariablesDatas();
    void read(QString path);
    void setDefault();
    QStandardItemModel* model() const;
    virtual void read(const QJsonObject &json);
    void readCommand(const QJsonArray &json, QStandardItemModel* l);
    virtual void write(QJsonObject &json) const;
    QJsonArray getArrayJSON(QStandardItemModel* l) const;
    SuperListItem* getVariableById(int id) const;
    SuperListItem* getById(QStandardItemModel *l, int id) const;

private:
    QStandardItemModel* p_model;
};

#endif // VARIABLESDATAS_H
