/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "widgettreelocalmaps.h"
#include "dialogmapproperties.h"
#include "dialogsystemname.h"
#include "wanok.h"
#include "treemapdatas.h"
#include <QDir>
#include <QDirIterator>
#include <QMessageBox>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTreeLocalMaps::WidgetTreeLocalMaps(QWidget *parent) :
    QTreeView(parent),
    m_model(nullptr),
    m_widgetMapEditor(nullptr),
    m_widgetMenuMapEditor(nullptr),
    m_panelTextures(nullptr),
    m_project(nullptr)
{
    this->setContextMenuPolicy(Qt::CustomContextMenu);

    // Context menu connections
    m_contextMenuMap = ContextMenuList::createContextMap(this);
    m_contextMenuDirectory = ContextMenuList::createContextDirectory(this);
    connect(this, SIGNAL(customContextMenuRequested(const QPoint &)),
            this, SLOT(showContextMenu(const QPoint &)));
}

WidgetTreeLocalMaps::~WidgetTreeLocalMaps()
{
    delete m_contextMenuMap;
    delete m_contextMenuDirectory;
}

void WidgetTreeLocalMaps::initializeWidgetMapEditor(WidgetMapEditor* w){
    m_widgetMapEditor = w;
}

void WidgetTreeLocalMaps::initializeWidgetMenuBar(WidgetMenuBarMapEditor* w){
    m_widgetMenuMapEditor = w;
}

void WidgetTreeLocalMaps::initializePanelTextures(
        PanelTextures* w)
{
    m_panelTextures = w;
}

void WidgetTreeLocalMaps::initializeModel(QStandardItemModel* m){
    m_model = m;
    this->setModel(m_model);
    this->expandAll();
    connect(this->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_selectionChanged(QModelIndex,QModelIndex)));
    QModelIndex modelIndex = m_model->index(0,0);
    setCurrentIndex(modelIndex);
}

void WidgetTreeLocalMaps::initializeProject(Project* p){
    m_project = p;
}

QStandardItem* WidgetTreeLocalMaps::getSelected() const{
    return m_model->itemFromIndex(this->selectionModel()->currentIndex());
}

QStandardItemModel* WidgetTreeLocalMaps::getModel() const { return m_model; }


// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

// -------------------------------------------------------
// check if a directory with that id in Maps folder already exists

bool WidgetTreeLocalMaps::isMapIdExisting(int id){
    QDirIterator directories(Wanok::pathCombine(Wanok::get()->project()
                                                ->pathCurrentProject(),
                                                Wanok::pathMaps),
                             QDir::Dirs | QDir::NoDotAndDotDot);

    while (directories.hasNext()){
        directories.next();
        if (directories.fileName() == generateMapName(id))
            return true;
    }

    return false;
}

// -------------------------------------------------------
// generate an id for a new map according to the ids of the already existing
// maps

int WidgetTreeLocalMaps::generateMapId(){
    int id;
    QDir dir(Wanok::pathCombine(Wanok::get()->project()->pathCurrentProject(),
                                Wanok::pathMaps));
    dir.setFilter(QDir::Dirs | QDir::NoDotAndDotDot);
    int nbMaps = dir.count();

    for (id = 1; id <= nbMaps + 1; id++)
        if (!isMapIdExisting(id)) break;

    return id;
}

// -------------------------------------------------------

QString WidgetTreeLocalMaps::generateMapName(int id){
    return "MAP" + Wanok::getFormatNumber(id);
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::updateNodeSaved(QStandardItem* item){
    TreeMapTag* tag = (TreeMapTag*) item->data().value<quintptr>();
    if (tag != nullptr)
        item->setText(tag->name());
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::updateAllNodesSaved(){
    updateNodesSaved(m_model->invisibleRootItem());
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::updateNodesSaved(QStandardItem* item){
    updateNodeSaved(item);

    for (int i = 0; i < item->rowCount(); i++){
        updateNodesSaved(item->child(i));
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::deleteAllMapTemp(){
    QString pathMaps = Wanok::pathCombine(Wanok::get()->project()
                                          ->pathCurrentProject(),
                                          Wanok::pathMaps);
    deleteMapTemp(pathMaps, m_model->invisibleRootItem());
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::deleteMapTemp(QString& path, QStandardItem* item){
    TreeMapTag* tag = (TreeMapTag*) item->data().value<quintptr>();

    if (tag != nullptr && !tag->isDir()){
        QString pathMap =
                Wanok::pathCombine(path,
                                   WidgetTreeLocalMaps::generateMapName(
                                       tag->id()));
        QString pathTemp = Wanok::pathCombine(pathMap,
                                              Wanok::tempMapFolderName);
        Wanok::deleteAllFiles(pathTemp);
    }
    else{
        for (int i = 0; i < item->rowCount(); i++){
            deleteMapTemp(path, item->child(i));
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::showMap(QStandardItem *item, int idMap,
                                  QVector3D* position)
{
    m_widgetMapEditor->deleteMap();

    if (m_project != nullptr)
        m_project->setCurrentMap(nullptr);

    m_widgetMapEditor->needUpdateMap(idMap, position);
    m_widgetMapEditor->setTreeMapNode(item);
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::hideMap(){

    if (m_widgetMenuMapEditor != nullptr)
        m_widgetMenuMapEditor->hide();

    m_widgetMapEditor->deleteMap();

    if (m_project != nullptr)
        m_project->setCurrentMap(nullptr);
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::setMap(int id, QVector3D &position){
    QStandardItem* item = getMap(id, this->getModel()->invisibleRootItem());
    if (item != nullptr){
        TreeMapTag* tag = (TreeMapTag*) item->data().value<quintptr>();
        tag->position()->setX(position.x());
        tag->position()->setY(position.y());
        tag->position()->setZ(position.z());
        this->setCurrentIndex(item->index());
    }
}

// -------------------------------------------------------

QStandardItem* WidgetTreeLocalMaps::getMap(int id, QStandardItem* item){
    TreeMapTag* tag = (TreeMapTag*) item->data().value<quintptr>();

    if (tag != nullptr && !tag->isDir()){
        if (tag->id() == id)
            return item;
    }
    else{
        for (int i = 0; i < item->rowCount(); i++){
            QStandardItem* itemMap = getMap(id, item->child(i));
            if (itemMap != nullptr)
                return itemMap;
        }
    }

    return nullptr;
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::deleteMap(QStandardItem* item){
    TreeMapTag* tag = (TreeMapTag*) item->data().value<quintptr>();
    QString mapPath =
            Wanok::pathCombine(Wanok::pathMaps,
                               WidgetTreeLocalMaps::generateMapName(tag->id()));

    QDir(Wanok::pathCombine(Wanok::get()->project()->pathCurrentProject(),
                            mapPath)).removeRecursively();

    // Remove from tree
    item->parent()->removeRow(item->row());
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::deleteDirectory(QStandardItem* item){
    TreeMapTag* tag;
    QStandardItem* child;
    QList<QStandardItem*> children;

    // Get all the children
    for (int i = 0; i < item->rowCount(); i++)
        children.append(item->child(i));

    // Recursively remove all the children
    for (int i = 0; i < children.size(); i++){
        child = children.at(i);
        tag = (TreeMapTag*) child->data().value<quintptr>();

        // Remove map or directory
        if (tag->isDir())
            deleteDirectory(child);
        else
            deleteMap(child);
    }

    // Remove from tree
    item->parent()->removeRow(item->row());
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::updateTileset(){
    if (m_panelTextures != nullptr){
        TreeMapTag* tag = (TreeMapTag*)getSelected()->data().value<quintptr>();

        if (tag->id() == -1)
            m_panelTextures->setTilesetImageNone();
        else{
            QString path = Wanok::pathCombine(
                            Wanok::pathCombine(Wanok::get()->project()
                                               ->pathCurrentProject(),
                                               Wanok::pathMaps),
                            generateMapName(tag->id()));
            MapProperties properties(path);
            m_panelTextures->setTilesetImage(
                        properties.tileset()->picture()
                        ->getPath(PictureKind::Tilesets));
        }
    }
}

// -------------------------------------------------------
//
//  CONTEXT MENU SLOTS
//
// -------------------------------------------------------

void WidgetTreeLocalMaps::on_selectionChanged(QModelIndex, QModelIndex){

    // Loading map
    if (m_widgetMapEditor != nullptr){
        QStandardItem* selected = getSelected();
        TreeMapTag* tag = (TreeMapTag*) selected->data().value<quintptr>();

        if (tag->id() == -1)
            hideMap();
        else
            showMap(selected, tag->id(), tag->position());

        // Loading tileset texture
        updateTileset();
    }

}

// -------------------------------------------------------
// showContextMenu: if right clicking, open this menu context

void WidgetTreeLocalMaps::showContextMenu(const QPoint & p){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        TreeMapTag* tag = (TreeMapTag*) selected->data().value<quintptr>();
        if (tag->isDir()){
            m_contextMenuDirectory->canDelete(selected->parent() != nullptr);
            m_contextMenuDirectory->showContextMenu(p);
        }
        else
            m_contextMenuMap->showContextMenu(p);
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextNewMap(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        MapProperties* properties = new MapProperties;
        properties->names()->updateNames();
        int id = WidgetTreeLocalMaps::generateMapId();
        properties->setId(id);
        properties->names()->setAllNames(
                    WidgetTreeLocalMaps::generateMapName(id));

        DialogMapProperties dialog(*properties);
        if (dialog.exec() == QDialog::Accepted){
            TreeMapTag* tag = TreeMapTag::createMap(properties->name(), id);
            TreeMapDatas::addMap(selected, selected->rowCount(), tag);
            Map::writeNewMap(Wanok::get()->project()->pathCurrentProject(),
                             *properties);
            Wanok::get()->project()->writeTreeMapDatas();

            // Loading tileset texture
            updateTileset();
        }
        else
            delete properties;
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextNewDirectory(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        SuperListItem super(-1, "Directory");
        DialogSystemName dialog(super);
        if (dialog.exec() == QDialog::Accepted){
            TreeMapTag* tag = TreeMapTag::createDir(super.name());
            QStandardItem* item = TreeMapDatas::addDir(selected,
                                                       selected->rowCount(),
                                                       tag);
            this->expand(item->index());
            Wanok::get()->project()->writeTreeMapDatas();
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextEditMap(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        TreeMapTag* tag = (TreeMapTag*) selected->data().value<quintptr>();
        QString path = Wanok::pathCombine(
                        Wanok::pathCombine(Wanok::get()->project()
                                           ->pathCurrentProject(),
                                           Wanok::pathMaps),
                        generateMapName(tag->id()));
        MapProperties properties(path);
        properties.names()->updateNames();

        DialogMapProperties dialog(properties);
        if (dialog.exec() == QDialog::Accepted){
            QString pathTemp = Wanok::pathCombine(path,
                                                  Wanok::tempMapFolderName);
            bool empty = Wanok::isDirEmpty(pathTemp);
            if (!empty){
                Wanok::deleteAllFiles(path);
                Wanok::copyAllFiles(pathTemp, path);
                Wanok::deleteAllFiles(pathTemp);
            }
            properties.save(path);
            TreeMapDatas::setName(selected, properties.name());
            Wanok::get()->project()->writeTreeMapDatas();
            showMap(selected, properties.id(), tag->position());

            // Loading tileset texture
            updateTileset();
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextEditDirectory(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        TreeMapTag* tag = (TreeMapTag*) selected->data().value<quintptr>();
        SuperListItem super;
        super.setName(tag->name());

        DialogSystemName dialog(super);
        if (dialog.exec() == QDialog::Accepted){
            TreeMapDatas::setName(selected, super.name());
            Wanok::get()->project()->writeTreeMapDatas();
        }
    }
}

// -------------------------------------------------------
void WidgetTreeLocalMaps::contextCopyMap(){

}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextCopyDirectory(){

}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextPaste(){

}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextDeleteMap(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        QMessageBox::StandardButton box =
               QMessageBox::warning(this, "Warning",
                                    "Are you sure you want to delete this map?",
                                    QMessageBox::Yes | QMessageBox::No);

        if (box == QMessageBox::Yes){
            deleteMap(selected);
            Wanok::get()->project()->writeTreeMapDatas();

            // Loading tileset texture
            updateTileset();
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextDeleteDirectory(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        QMessageBox::StandardButton box =
                QMessageBox::warning(this, "Warning",
                                     "Are you sure you want to delete this "
                                     "directory?\n This will delete all the "
                                     "maps inside this folder.",
                                      QMessageBox::Yes | QMessageBox::No);

        if (box == QMessageBox::Yes){
            deleteDirectory(selected);
            Wanok::get()->project()->writeTreeMapDatas();

            // Loading tileset texture
            updateTileset();
        }
    }
}
