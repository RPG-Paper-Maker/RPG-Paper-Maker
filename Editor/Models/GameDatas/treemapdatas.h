/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef TREEMAPDATAS_H
#define TREEMAPDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "treemaptag.h"

// -------------------------------------------------------
//
//  CLASS TreeMapDatas
//
//  The data file is located in
//  Content/Datas/treeMap.json.
//
// -------------------------------------------------------

class TreeMapDatas : public Serializable
{
public:
    TreeMapDatas();
    virtual ~TreeMapDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    QStandardItem* root() const;
    void setDefault();
    void addDefaultBattleMap(int mapID);
    void addMapSelectorDir();
    void clearModel();
    static QStandardItem* add(QStandardItem *root, int i, TreeMapTag *tag,
                              QString iconName);
    static QStandardItem* addDir(QStandardItem *root, int i, TreeMapTag *tag);
    static QStandardItem* addMap(QStandardItem *root, int i, TreeMapTag *tag);
    static void setName(QStandardItem *item, QString name);

    void translate();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;

private:
    void readRoot(const QJsonArray &json, QStandardItem* root);
    QJsonArray getChildrenJSON(QStandardItem* item) const;
};

#endif // TREEMAPDATAS_H
