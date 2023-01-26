/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangestate.h"
#include "ui_dialogcommandchangestate.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeState::DialogCommandChangeState(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeState),
    m_properties(properties),
    m_parameters(parameters),
    m_modelMaps(new QStandardItemModel),
    m_modelObjects(new QStandardItemModel)
{
    ui->setupUi(this);

    initializeStateId();
    if (command != nullptr)
    {
        this->initialize(command);
    }

    this->translate();
}

DialogCommandChangeState::~DialogCommandChangeState()
{
    delete ui;

    SuperListItem::deleteModel(m_modelMaps);
    SuperListItem::deleteModel(m_modelObjects);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeState::initializeMaps()
{
    QStandardItem *item = new QStandardItem;
    SuperListItem *super = new SuperListItem(-1, RPM::translate(Translations
        ::THIS_MAP));
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setText(super->name());
    m_modelMaps->appendRow(item);
    this->initializeMapsInfos(RPM::get()->project()->treeMapDatas()->model()
        ->invisibleRootItem(), "", 0);
    this->on_mapIDUpdated(-1);
}

// -------------------------------------------------------

void DialogCommandChangeState::initializeMapsInfos(QStandardItem *item, QString
    path, int level)
{
    QStandardItem *child, *itemTag;
    TreeMapTag *tag;
    SuperListItem *super;
    for (int i = 0, l = item->rowCount(); i < l; i++)
    {
        child = item->child(i);
        tag = reinterpret_cast<TreeMapTag *>(child->data().value<quintptr>());
        if (tag->isDir())
        {
            this->initializeMapsInfos(child, (level == 0 ? path : (level == 1 ?
                tag->name() : Common::pathCombine(path, tag->name()))), level +
                1);
        } else
        {
            super = new SuperListItem(tag->id(), tag->name());
            itemTag = new QStandardItem;
            itemTag->setData(QVariant::fromValue(reinterpret_cast<quintptr>(
                super)));
            itemTag->setText(Common::pathCombine(path, super->name()));
            m_modelMaps->appendRow(itemTag);
        }
    }
}

// -------------------------------------------------------

void DialogCommandChangeState::initializeObjects(int id, bool isCurrentMap)
{
    SuperListItem::deleteModel(m_modelObjects, false);
    QString realName = Map::generateMapName(id);
    QString pathMaps = Common::pathCombine(RPM::get()->project()
                                          ->pathCurrentProjectApp(),
                                          RPM::PATH_MAPS);
    QString pathMap = Common::pathCombine(pathMaps, realName);
    QString pathMapTemp = Common::pathCombine(pathMap, RPM::FOLDER_TEMP);
    QString path = Common::pathCombine(pathMapTemp, RPM::FILE_MAP_OBJECTS);
    if (!QFile(path).exists())
    {
        path = Common::pathCombine(pathMap, RPM::FILE_MAP_OBJECTS);
    }
    QJsonDocument loadDoc;
    Common::readOtherJSON(path, loadDoc);
    QJsonObject json = loadDoc.object();
    Map::readJSONArray(m_modelObjects, json["objs"].toArray());

    // If no
    if (!isCurrentMap)
    {
        delete reinterpret_cast<SuperListItem *>(m_modelObjects->item(0)->data()
            .value<quintptr>());
        delete reinterpret_cast<SuperListItem *>(m_modelObjects->item(1)->data()
            .value<quintptr>());
        m_modelObjects->removeRow(0);
        m_modelObjects->removeRow(0);
    }
    ui->panelPrimitiveObjectID->clearDataBase();
}

// -------------------------------------------------------

void DialogCommandChangeState::initializeStateId(){
    connect(ui->panelPrimitiveMapID, SIGNAL(numberUpdated(int)), this, SLOT(
        on_mapIDUpdated(int)));
    Map::setModelObjects(m_modelObjects);
    ui->panelPrimitiveObjectID->initializeDataBaseCommandId(m_modelObjects,
        m_parameters, m_properties);
    this->initializeMaps();
    ui->panelPrimitiveMapID->initializeDataBaseCommandId(m_modelMaps,
        m_parameters, m_properties);
    ui->widgetStateId->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->commonEventsDatas()->modelStates(), m_parameters,
        m_properties);
}

//-------------------------------------------------

void DialogCommandChangeState::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_STATE) + RPM
        ::DOT_DOT_DOT);
    ui->groupBoxObject->setTitle(RPM::translate(Translations::OBJECT));
    ui->labelMapID->setText(RPM::translate(Translations::MAP_ID) + RPM::COLON);
    ui->labelObjectID->setText(RPM::translate(Translations::OBJECT_ID) + RPM::COLON);
    ui->labelStateID->setText(RPM::translate(Translations::STATE_ID) + RPM
        ::COLON);
    ui->radioButtonAdd->setText(RPM::translate(Translations::ADD));
    ui->radioButtonRemove->setText(RPM::translate(Translations::REMOVE));
    ui->radioButtonReplace->setText(RPM::translate(Translations::REPLACE));
    ui->groupBoxOperation->setTitle(RPM::translate(Translations::OPERATION));
    ui->groupBoxSelection->setTitle(RPM::translate(Translations::SELECTION));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------

void DialogCommandChangeState::initialize(EventCommand* command){
    int i = 0;

    ui->panelPrimitiveMapID->initializeCommand(command, i);
    ui->panelPrimitiveObjectID->initializeCommand(command, i);
    ui->widgetStateId->initializeCommand(command,i);
    int action = command->valueCommandAt(i++).toInt();
    switch(action){
    case 0:
        ui->radioButtonReplace->setChecked(true); break;
    case 1:
        ui->radioButtonAdd->setChecked(true); break;
    case 2:
        ui->radioButtonRemove->setChecked(true); break;
    }
}

// -------------------------------------------------------

EventCommand* DialogCommandChangeState::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveMapID->getCommand(command);
    ui->panelPrimitiveObjectID->getCommand(command);
    selectionState(command);
    operation(command);

    return new EventCommand(EventCommandKind::ChangeState, command);
}

// -------------------------------------------------------

void DialogCommandChangeState::selectionState(QVector<QString>& command) const{
    ui->widgetStateId->getCommand(command);
}

// -------------------------------------------------------

void DialogCommandChangeState::operation(QVector<QString>& command) const{
    if (ui->radioButtonReplace->isChecked()) command.append("0");
    else if (ui->radioButtonAdd->isChecked()) command.append("1");
    else if (ui->radioButtonRemove->isChecked()) command.append("2");
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeState::on_mapIDUpdated(int i)
{
    Map *map = RPM::get()->project()->currentMap(true);
    int mapID = (RPM::isInConfig && !RPM::isInObjectConfig) ? -1 : (map ==
        nullptr ? -1 : map->mapProperties()->id());
    if (i == -1)
    {
        i = mapID;
    }
    this->initializeObjects(i, mapID == i);
}


