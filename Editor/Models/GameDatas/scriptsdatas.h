/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SCRIPTSDATAS_H
#define SCRIPTSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS ScriptsDatas
//
//  The data file is located in
//  Content/Datas/scripts.json.
//
// -------------------------------------------------------

class ScriptsDatas : public Serializable
{
public:
    ScriptsDatas();
    virtual ~ScriptsDatas();
    void read(QString path);
    QStandardItemModel* modelSystem() const;
    QStandardItemModel* modelPlugins() const;
    void setDefault();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
    void writeDesktop(QString path) const;
    void writeBrowser(QString path) const;

private:
    QStandardItemModel* m_modelSystem;
    QStandardItemModel* m_modelPlugins;
};

#endif // SCRIPTSDATAS_H
