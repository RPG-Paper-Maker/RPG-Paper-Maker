/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
    QStandardItemModel * modelSystem() const;
    QStandardItemModel * modelPlugins() const;
    QStandardItemModel * modelLibs() const;
    QStandardItemModel * modelShaders() const;

    bool containsPluginName(QString name) const;
    bool allScriptsSaved() const;
    bool allPluginsSaved() const;
    void setDefault();
    void readSystem();
    void readLibs();
    void readShaders();
    void readFolder(QStandardItem *root, QString path);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel *m_modelSystem;
    QStandardItemModel *m_modelPlugins;
    QStandardItemModel *m_modelLibs;
    QStandardItemModel *m_modelShaders;
};

#endif // SCRIPTSDATAS_H
