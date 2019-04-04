/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
