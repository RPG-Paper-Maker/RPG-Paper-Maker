/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef CLASSESDATAS_H
#define CLASSESDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS ClassesDatas
//
//  Contains all the possible classes of a game. The data file is located in
//  Content/Datas/classes.json.
//
// -------------------------------------------------------

class ClassesDatas : public Serializable
{
public:
    ClassesDatas();
    virtual ~ClassesDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault(QStandardItem* modelSkills, QStandardItem *modelStatistics);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // CLASSESDATAS_H
