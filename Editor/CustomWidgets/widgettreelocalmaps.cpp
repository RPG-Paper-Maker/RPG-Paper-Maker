/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgettreelocalmaps.h"
#include "dialogmapproperties.h"
#include "dialogsystemname.h"
#include "rpm.h"
#include "common.h"
#include "treemapdatas.h"
#include <QDir>
#include <QMessageBox>
#include <QtMath>

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
    m_project(nullptr),
    m_copied(nullptr)
{
    // Drag & drop
    this->setAcceptDrops(true);
    this->setDragEnabled(true);
    this->setDefaultDropAction(Qt::MoveAction);
    this->setDragDropMode(QAbstractItemView::InternalMove);
    this->setDefaultDropAction(Qt::TargetMoveAction);
    this->showDropIndicator();

    // Context menu connections
    this->setContextMenuPolicy(Qt::CustomContextMenu);
    m_contextMenuMap = ContextMenuList::createContextMap(this);
    m_contextMenuDirectory = ContextMenuList::createContextDirectory(this);
    connect(this, SIGNAL(customContextMenuRequested(const QPoint &)), this, SLOT(
        showContextMenu(const QPoint &)));
}

WidgetTreeLocalMaps::~WidgetTreeLocalMaps()
{
    delete m_contextMenuMap;
    delete m_contextMenuDirectory;
    this->cleanCopy();
}

void WidgetTreeLocalMaps::initializeWidgetMapEditor(WidgetMapEditor *w)
{
    m_widgetMapEditor = w;
}

void WidgetTreeLocalMaps::initializeWidgetMenuBar(WidgetMenuBarMapEditor *w)
{
    m_widgetMenuMapEditor = w;
}

void WidgetTreeLocalMaps::initializePanelTextures(PanelTextures *w)
{
    m_panelTextures = w;
}

void WidgetTreeLocalMaps::initializeModel(QStandardItemModel *m)
{
    m_model = m;
    this->setModel(m_model);
    this->expandAll();
    connect(this->selectionModel(), SIGNAL(currentChanged(QModelIndex,QModelIndex)),
        this, SLOT(on_selectionChanged(QModelIndex,QModelIndex)));
    if (!setCurrentIndexFirstMap(m_model->invisibleRootItem()))
    {
        QModelIndex modelIndex = m_model->index(0, 0);
        this->setCurrentIndex(modelIndex);
    }
    connect(m_model, SIGNAL(rowsRemoved(QModelIndex,int,int)), this, SLOT(removed(
        QModelIndex,int,int)));

    // Set if saved
    QSet<int> mapsToSave;
    RPM::get()->project()->readMapsToSave(mapsToSave);
    this->updateNotSaved(m->invisibleRootItem(), mapsToSave);

}

void WidgetTreeLocalMaps::initializeProject(Project *p)
{
    m_project = p;
    m_pathProject = p->pathCurrentProjectApp();
}

QStandardItem * WidgetTreeLocalMaps::getSelected() const
{
    return m_model->itemFromIndex(this->selectionModel()->currentIndex());
}

QStandardItemModel * WidgetTreeLocalMaps::getModel() const
{
    return m_model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTreeLocalMaps::updateNodeSaved(QStandardItem *item)
{
    TreeMapTag *tag = reinterpret_cast<TreeMapTag*>(item->data().value<quintptr>());
    if (tag != nullptr)
    {
        item->setText(tag->name());
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::updateAllNodesSaved()
{
    this->updateNodesSaved(m_model->invisibleRootItem());
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::updateNodesSaved(QStandardItem *item)
{
    this->updateNodeSaved(item);
    for (int i = 0; i < item->rowCount(); i++)
    {
        updateNodesSaved(item->child(i));
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::deleteAllMapTemp(){
    QString pathMaps = Common::pathCombine(RPM::get()->project()
                                          ->pathCurrentProjectApp(),
                                          RPM::PATH_MAPS);
    deleteMapTemp(pathMaps, m_model->invisibleRootItem());
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::deleteMapTemp(QString &path, QStandardItem *item)
{
    TreeMapTag *tag = reinterpret_cast<TreeMapTag*>(item->data().value
        <quintptr>());
    if (tag != nullptr && !tag->isDir())
    {
        QString pathMap = Common::pathCombine(path, Map::generateMapName(tag->id()));
        QString pathTemp = Common::pathCombine(pathMap, RPM::FOLDER_TEMP);
        Common::deleteAllFiles(pathTemp);
        pathTemp = Common::pathCombine(pathMap, RPM::FOLDER_UNDO_REDO_TEMP_MAP);
        Common::deleteAllFiles(pathTemp);
    } else
    {
        for (int i = 0; i < item->rowCount(); i++)
        {
            this->deleteMapTemp(path, item->child(i));
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::showMap(QStandardItem *item) {
    TreeMapTag* tag = reinterpret_cast<TreeMapTag*>(item->data().value
        <quintptr>());
    m_widgetMapEditor->deleteMap();

    if (m_project != nullptr)
        m_project->setCurrentMap(nullptr);

    m_widgetMapEditor->needUpdateMap(tag->id(), tag->position(),
                                     tag->positionObject(),
                                     tag->cameraDistance(),
                                     tag->cameraHorizontalAngle(),
                                     tag->cameraVerticalAngle());
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
        TreeMapTag* tag = reinterpret_cast<TreeMapTag*>(item->data().value
            <quintptr>());
        tag->position()->setX(position.x());
        tag->position()->setY(position.y());
        tag->position()->setZ(position.z());
        this->selectionModel()->setCurrentIndex(item->index(),
            QItemSelectionModel::Select);
        this->setCurrentIndex(item->index());
    }
}

// -------------------------------------------------------

QStandardItem* WidgetTreeLocalMaps::getMap(int id, QStandardItem* item){
    TreeMapTag* tag = reinterpret_cast<TreeMapTag*>(item->data().value
        <quintptr>());

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
    TreeMapTag* tag = reinterpret_cast<TreeMapTag*>(item->data().value
        <quintptr>());
    QString mapPath =
            Common::pathCombine(RPM::PATH_MAPS,
                               Map::generateMapName(tag->id()));

    QDir(Common::pathCombine(RPM::get()->project()->pathCurrentProjectApp(),
                            mapPath)).removeRecursively();

    // Remove id from maps to save
    QSet<int> mapsToSave;
    RPM::get()->project()->readMapsToSave(mapsToSave);
    mapsToSave.remove(tag->id());
    RPM::get()->project()->writeMapsToSave(mapsToSave);

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
        tag = reinterpret_cast<TreeMapTag*>(child->data().value<quintptr>());

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
        TreeMapTag* tag = reinterpret_cast<TreeMapTag*>(getSelected()->data()
            .value<quintptr>());

        if (tag->id() == -1)
            m_panelTextures->setTilesetImageNone();
        else {
            QString path = Common::pathCombine(
                            Common::pathCombine(RPM::get()->project()
                                               ->pathCurrentProjectApp(),
                                               RPM::PATH_MAPS),
                            Map::generateMapName(tag->id()));
            MapProperties properties(path);
            SystemTileset* tileset = properties.tileset();
            switch (m_widgetMenuMapEditor->subSelectionKind()) {
            case MapEditorSubSelectionKind::Autotiles:
                m_panelTextures->showAutotiles(tileset);
                break;
            case MapEditorSubSelectionKind::SpritesWall:
                m_panelTextures->showSpriteWalls(tileset);
                break;
            case MapEditorSubSelectionKind::Mountains:
                m_panelTextures->showMountains(tileset);
                break;
            case MapEditorSubSelectionKind::Object3D:
                m_panelTextures->showObjects3D(tileset);
                break;
            default:
                m_panelTextures->showTileset();
                m_panelTextures->setTilesetImage(tileset->picture()->getPath());
                break;
            }
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::reload()
{
    // Loading map
    if (m_widgetMapEditor != nullptr)
    {
        QStandardItem *selected;

        selected = getSelected();
        if (selected != nullptr)
        {
            TreeMapTag *tag;

            tag = reinterpret_cast<TreeMapTag*>(selected->data().value<quintptr>());
            if (tag->id() == -1)
            {
                this->hideMap();
            } else {
                this->showMap(selected);
            }

            // Loading tileset texture
            this->updateTileset();
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::copy(QStandardItem* item){

    // Clean previous copy
    cleanCopy();

    // New copy
    m_copied = new QStandardItem;
    TreeMapTag::copyItem(item, m_copied);
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::cleanCopy(){
    if (m_copied != nullptr){
        SuperListItem::deleteModelTree(m_copied);
        delete reinterpret_cast<SuperListItem*>(m_copied->data().value
            <qintptr>());
        delete m_copied;
        m_copied = nullptr;

        // Remove files temp
        QString pathMaps = Common::pathCombine(m_pathProject, RPM::PATH_MAPS);
        QDir(Common::pathCombine(
                 pathMaps, RPM::FOLDER_TEMP)).removeRecursively();
        QDir(pathMaps).mkdir(RPM::FOLDER_TEMP);
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::paste(QStandardItem* item){
    QStandardItem* copy = new QStandardItem;
    QModelIndex index;

    // Insert tree
    TreeMapTag::copyTree(m_copied, copy);
    item->insertRow(item->rowCount(), copy);
    RPM::get()->project()->writeTreeMapDatas();

    // Select the pasted map node
    index = copy->index();
    this->selectionModel()->clear();
    this->selectionModel()->setCurrentIndex(index, QItemSelectionModel
        ::Select);

    // If dir, expand all
    this->expandAllNode(copy);
}

// -------------------------------------------------------

bool WidgetTreeLocalMaps::setCurrentIndexFirstMap(QStandardItem* item) {
    if (item->rowCount() == 0) {
        setCurrentIndex(item->index());
        return true;
    }

    for (int i = 0; i < item->rowCount(); i++) {
        if (setCurrentIndexFirstMap(item->child(i))) {
            return true;
        }
    }

    return false;
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::expandAllNode(QStandardItem *item)
{
    int i, l;

    for (i = 0, l = item->rowCount(); i < l; i++)
    {
        this->expandAllNode(item->child(i));
    }
    this->setExpanded(item->index(), true);
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::disableContextMenu()
{
    this->setContextMenuPolicy(Qt::NoContextMenu);
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::updateSquareSizeCoef(float s, float ps)
{
    this->updateSquareSizeCoefItem(s, ps, m_model->invisibleRootItem());
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::updateSquareSizeCoefItem(float s, float ps, QStandardItem
    *item)
{
    TreeMapTag *tag;
    for (int i = 0, l = item->rowCount(); i < l; i++)
    {
        QStandardItem *child = item->child(i);
        tag = reinterpret_cast<TreeMapTag *>(child->data().value<quintptr>());

        if (tag->isDir())
        {
            this->updateSquareSizeCoefItem(s, ps, child);
        } else
        {
            tag->position()->setX(tag->position()->x() / ps * s);
            tag->position()->setY((static_cast<int>(tag->position()->y()) /
                static_cast<int>(ps) * s) + qFloor(static_cast<double>((
                static_cast<int>(tag->position()->y()) % static_cast<int>(ps)) *
                (s / ps))));
            tag->position()->setZ(tag->position()->z() / ps * s);
            tag->setCameraDistance(qRound(tag->cameraDistance() / ps * s));
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::updateNotSaved(QStandardItem *item, QSet<int> mapsToSave)
{
    TreeMapTag *tag;
    for (int i = 0, l = item->rowCount(); i < l; i++)
    {
        QStandardItem *child = item->child(i);
        tag = reinterpret_cast<TreeMapTag *>(child->data().value<quintptr>());
        if (tag->isDir())
        {
            this->updateNotSaved(child, mapsToSave);
        } else
        {
            if (mapsToSave.contains(tag->id()))
            {
                child->setText(child->text() + " *");
            }
        }
    }
}

// -------------------------------------------------------
//
//  CONTEXT MENU SLOTS
//
// -------------------------------------------------------

void WidgetTreeLocalMaps::on_selectionChanged(QModelIndex, QModelIndex){
    reload();
}

// -------------------------------------------------------
// showContextMenu: if right clicking, open this menu context

void WidgetTreeLocalMaps::showContextMenu(const QPoint & p){
    QStandardItem* selected = getSelected();
    if (selected != nullptr) {
        TreeMapTag* tag = reinterpret_cast<TreeMapTag*>(selected->data().value
            <quintptr>());
        if (tag->isDir()){
            m_contextMenuDirectory->canPaste(m_copied != nullptr);
            m_contextMenuDirectory->canDelete(selected->parent() != nullptr);
            m_contextMenuDirectory->showContextMenu(p);
        }
        else
            m_contextMenuMap->showContextMenu(p);
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::keyPressEvent(QKeyEvent *event) {
    QKeySequence seq = Common::getKeySequence(event);
    QKeySequence seqBackspace(Qt::Key_Backspace);
    QStandardItem* selected = getSelected();
    QList<QAction*> actions;
    QAction* action;
    if (selected != nullptr) {
        TreeMapTag* tag = reinterpret_cast<TreeMapTag*>(selected->data().value
            <quintptr>());
        if (tag->isDir()) {
            actions = m_contextMenuDirectory->actions();
            action = actions.at(0);
            if (action->shortcut().matches(seq) && action->isEnabled()) {
                contextNewMap();
                return;
            }
            action = actions.at(1);
            if (action->shortcut().matches(seq) && action->isEnabled()) {
                contextNewDirectory();
                return;
            }
            action = actions.at(2);
            if (Common::isPressingEnter(event) && action->isEnabled()) {
                contextEditDirectory();
                return;
            }
            action = actions.at(4);
            if (action->shortcut().matches(seq) && action->isEnabled()) {
                contextCopyDirectory();
                return;
            }
            action = actions.at(5);
            if (action->shortcut().matches(seq) && action->isEnabled()) {
                contextPaste();
                return;
            }
            action = actions.at(7);
            if ((action->shortcut().matches(seq) || seq.matches(seqBackspace)) &&
                action->isEnabled())
            {
                contextDeleteDirectory();
                return;
            }
        }
        else {
            actions = m_contextMenuMap->actions();
            action = actions.at(0);
            if (Common::isPressingEnter(event) && action->isEnabled()) {
                contextEditMap();
                return;
            }
            action = actions.at(2);
            if (action->shortcut().matches(seq) && action->isEnabled()) {
                contextCopyMap();
                return;
            }
            action = actions.at(4);
            if ((action->shortcut().matches(seq) || seq.matches(seqBackspace)) &&
                action->isEnabled())
            {
                contextDeleteMap();
                return;
            }
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextNewMap(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        MapProperties properties;
        properties.updateNames();
        int id = Map::generateMapId();
        properties.setId(id);
        properties.setAllNames(Map::generateMapName(id));

        DialogMapProperties dialog(properties);
        if (dialog.exec() == QDialog::Accepted){
            TreeMapTag* tag = TreeMapTag::createMap(properties.name(), id);
            QStandardItem *item = TreeMapDatas::addMap(selected, selected
                ->rowCount(), tag);
            Map::writeNewMap(RPM::get()->project()->pathCurrentProjectApp(),
                             properties);
            RPM::get()->project()->writeTreeMapDatas();

            // Loading tileset texture
            updateTileset();

            // Select the new map node
            QModelIndex index = item->index();
            this->selectionModel()->clear();
            this->selectionModel()->setCurrentIndex(index, QItemSelectionModel
                ::Select);
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextNewDirectory(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        SuperListItem super(-1, RPM::translate(Translations::DIRECTORY));
        DialogSystemName dialog(super);
        if (dialog.exec() == QDialog::Accepted){
            TreeMapTag* tag = TreeMapTag::createDir(super.name());
            QStandardItem* item = TreeMapDatas::addDir(selected,
                                                       selected->rowCount(),
                                                       tag);
            QModelIndex index;
            index = item->index();
            this->expand(index);
            RPM::get()->project()->writeTreeMapDatas();

            // Select the new directory node
            this->selectionModel()->clear();
            this->selectionModel()->setCurrentIndex(index, QItemSelectionModel
                ::Select);
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextEditMap(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        TreeMapTag* tag = reinterpret_cast<TreeMapTag*>(selected->data().value
            <quintptr>());
        QString path = Common::pathCombine(
                        Common::pathCombine(RPM::get()->project()
                                           ->pathCurrentProjectApp(),
                                           RPM::PATH_MAPS),
                        Map::generateMapName(tag->id()));
        MapProperties properties(path);
        properties.updateNames();
        MapProperties previousProperties;
        previousProperties.setCopy(properties);

        DialogMapProperties dialog(properties);
        if (dialog.exec() == QDialog::Accepted){
            QString pathTemp = Common::pathCombine(path,
                                                  RPM::FOLDER_TEMP);
            QSet<int> mapsToSave;
            RPM::get()->project()->readMapsToSave(mapsToSave);
            if (mapsToSave.contains(properties.id())) {
                Common::copyAllFiles(pathTemp, path);
                Common::deleteAllFiles(pathTemp);
                mapsToSave.remove(properties.id());
                RPM::get()->project()->writeMapsToSave(mapsToSave);
            }
            properties.save(path);
            Map::correctMap(path, previousProperties, properties);
            TreeMapDatas::setName(selected, properties.name());
            RPM::get()->project()->writeTreeMapDatas();

            // Adjust positions if map size was changed
            properties.adjustPosition(tag->position());
            properties.adjustPosition(tag->positionObject());

            showMap(selected);

            // Loading tileset texture
            updateTileset();
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextEditDirectory(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        TreeMapTag* tag = reinterpret_cast<TreeMapTag*>(selected->data().value
            <quintptr>());
        SuperListItem super;
        super.setName(tag->name());

        DialogSystemName dialog(super);
        if (dialog.exec() == QDialog::Accepted){
            TreeMapDatas::setName(selected, super.name());
            RPM::get()->project()->writeTreeMapDatas();
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextCopyMap(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        copy(selected);
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextCopyDirectory(){
    contextCopyMap();
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextPaste(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        paste(selected);
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextDeleteMap(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        QMessageBox box(QMessageBox::Warning, RPM::translate(Translations::WARNING),
            RPM::translate(Translations::ARE_YOU_SURE_DELETE_THIS_MAP),
            QMessageBox::Yes | QMessageBox::No);
        box.setButtonText(QMessageBox::Yes, RPM::translate(Translations::YES));
        box.setButtonText(QMessageBox::No, RPM::translate(Translations::NO));
        if (box.exec() == QMessageBox::Yes)
        {
            deleteMap(selected);
            RPM::get()->project()->writeTreeMapDatas();

            // Loading tileset texture
            updateTileset();
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::contextDeleteDirectory(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr)
    {
        QMessageBox box(QMessageBox::Warning, RPM::translate(Translations::WARNING),
            RPM::translate(Translations::ARE_YOU_SURE_DELETE_THIS_DIRECTORY) +
            RPM::NEW_LINE + RPM::SPACE + RPM::translate(Translations
            ::THIS_WILL_DELETE_ALL_MAPS_INSIDE_FOLDER) + RPM::DOT, QMessageBox
            ::Yes | QMessageBox::No);
        box.setButtonText(QMessageBox::Yes, RPM::translate(Translations::YES));
        box.setButtonText(QMessageBox::No, RPM::translate(Translations::NO));
        if (box.exec() == QMessageBox::Yes)
        {
            deleteDirectory(selected);
            RPM::get()->project()->writeTreeMapDatas();

            // Loading tileset texture
            updateTileset();
        }
    }
}

// -------------------------------------------------------

void WidgetTreeLocalMaps::removed(QModelIndex,int,int){
    RPM::get()->project()->writeTreeMapDatas();
}
