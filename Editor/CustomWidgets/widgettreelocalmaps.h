/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETTREELOCALMAPS_H
#define WIDGETTREELOCALMAPS_H

#include <QTreeView>
#include <QStandardItemModel>
#include "contextmenulist.h"
#include "mapproperties.h"
#include "widgettilesetselector.h"
#include "project.h"
#include "widgetmapeditor.h"

// -------------------------------------------------------
//
//  CLASS WidgetTreeLocalMaps
//
//  A widget representing the tree of local maps.
//
// -------------------------------------------------------

class PanelProject;

class WidgetTreeLocalMaps : public QTreeView
{
    Q_OBJECT

public:
    explicit WidgetTreeLocalMaps(QWidget *parent = 0);
    ~WidgetTreeLocalMaps();
    void initializeWidgetMapEditor(WidgetMapEditor* w);
    void initializeWidgetMenuBar(WidgetMenuBarMapEditor* w);
    void initializePanelTextures(PanelTextures* w);
    void initializeProject(Project* p);
    void initializeModel(QStandardItemModel* m);
    QStandardItem* getSelected() const;
    QStandardItemModel* getModel() const;
    static void updateNodeSaved(QStandardItem* item);
    void updateAllNodesSaved();
    void deleteAllMapTemp();
    void showMap(QStandardItem* item);
    void hideMap();
    void setMap(int id, QVector3D& position);
    void deleteMap(QStandardItem* item);
    void deleteDirectory(QStandardItem* item);
    void reload();
    void copy(QStandardItem* item);
    void cleanCopy();
    void paste(QStandardItem* item);
    bool setCurrentIndexFirstMap(QStandardItem* item);

protected:
    virtual void keyPressEvent(QKeyEvent *event);

private:
    QStandardItemModel* m_model;
    ContextMenuList* m_contextMenuMap;
    ContextMenuList* m_contextMenuDirectory;
    WidgetMapEditor* m_widgetMapEditor;
    WidgetMenuBarMapEditor* m_widgetMenuMapEditor;
    PanelTextures* m_panelTextures;
    Project* m_project;
    QStandardItem* m_copied;
    QString m_pathProject;

    void updateNodesSaved(QStandardItem* item);
    void deleteMapTemp(QString &path, QStandardItem* item);
    QStandardItem* getMap(int id, QStandardItem* item);
    void updateTileset();

public slots:
    void on_selectionChanged(QModelIndex, QModelIndex);
    void showContextMenu(const QPoint & p);
    void contextNewMap();
    void contextNewDirectory();
    void contextEditMap();
    void contextEditDirectory();
    void contextCopyMap();
    void contextCopyDirectory();
    void contextPaste();
    void contextDeleteMap();
    void contextDeleteDirectory();
    void removed(QModelIndex,int,int);
};

#endif // WIDGETTREELOCALMAPS_H
