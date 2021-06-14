/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangemapproperties.h"
#include "ui_dialogcommandchangemapproperties.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeMapProperties::DialogCommandChangeMapProperties(EventCommand
    *command, QStandardItemModel *properties, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeMapProperties),
    m_properties(properties),
    m_parameters(parameters),
    m_modelMaps(new QStandardItemModel)
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        this->initialize(command);
    }
    this->translate();
}

DialogCommandChangeMapProperties::~DialogCommandChangeMapProperties()
{
    delete ui;
    SuperListItem::deleteModel(m_modelMaps);
    delete ui->widgetSongMusic->song();
    delete ui->widgetSongBackgroundMusic->song();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeMapProperties::initializePrimitives()
{
    m_modelMaps->appendRow((new SuperListItem(-1, RPM::translate(Translations
        ::THIS_MAP)))->getModelRow());
    this->initializeMapsInfos(RPM::get()->project()->treeMapDatas()->model()
        ->invisibleRootItem(), "", 0);
    ui->panelPrimitiveMapID->initializeDataBaseCommandId(m_modelMaps, m_parameters,
        m_properties);
    ui->panelPrimitiveTilesetID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->tilesetsDatas()->model(), m_parameters, m_properties);
    SystemPlaySong *song = new SystemPlaySong(-1, SongKind::Music);
    song->updateName();
    song->setParameters(m_parameters);
    song->setProperties(m_properties);
    ui->widgetSongMusic->initialize(song);
    song = new SystemPlaySong(-1, SongKind::BackgroundSound);
    song->updateName();
    song->setParameters(m_parameters);
    song->setProperties(m_properties);
    ui->widgetSongBackgroundMusic->initialize(song);
    ui->panelPrimitiveCameraPropertiesID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelcameraProperties(),
        m_parameters, m_properties);
    ui->panelPrimitiveColorID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), m_parameters, m_properties);
    ui->panelPrimitiveSkyboxID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->systemDatas()->modelSkyBoxes(), m_parameters, m_properties);
}

// -------------------------------------------------------

void DialogCommandChangeMapProperties::initializeMapsInfos(QStandardItem *item,
    QString path, int level)
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

void DialogCommandChangeMapProperties::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_MAP_PROPERTIES) + RPM::DOT_DOT_DOT);
    ui->labelMapID->setText(RPM::translate(Translations::MAP_ID) + RPM::COLON);
    ui->groupBoxProperties->setTitle(RPM::translate(Translations::PROPERTIES));
    ui->checkBoxTilesetID->setText(RPM::translate(Translations::TILESET_ID) + RPM::COLON);
    ui->checkBoxMusic->setText(RPM::translate(Translations::MUSIC) + RPM::COLON);
    ui->checkBoxBackgroundMusic->setText(RPM::translate(Translations::BACKGROUND_SOUND) + RPM::COLON);
    ui->checkBoxCameraPropertiesID->setText(RPM::translate(Translations::CAMERA_PROPERTIES_ID) + RPM::COLON);
    ui->checkBoxSky->setText(RPM::translate(Translations::SKY) + RPM::COLON);
    ui->radioButtonColorID->setText(RPM::translate(Translations::COLOR_ID) + RPM::COLON);
    ui->radioButtonSkyboxID->setText(RPM::translate(Translations::SKYBOX_ID) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandChangeMapProperties::getCommand() const
{
    QVector<QString> command;
    return new EventCommand(EventCommandKind::ChangeMapProperties, command);
}

// -------------------------------------------------------

void DialogCommandChangeMapProperties::initialize(EventCommand *command)
{
    int i = 0;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeMapProperties::on_checkBoxTilesetID_toggled(bool checked)
{
    ui->panelPrimitiveTilesetID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeMapProperties::on_checkBoxMusic_toggled(bool checked)
{
    ui->widgetSongMusic->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeMapProperties::on_checkBoxBackgroundMusic_toggled(bool checked)
{
    ui->widgetSongBackgroundMusic->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeMapProperties::on_checkBoxCameraPropertiesID_toggled(bool checked)
{
    ui->panelPrimitiveCameraPropertiesID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeMapProperties::on_checkBoxSky_toggled(bool checked)
{
    ui->radioButtonColorID->setEnabled(checked);
    ui->radioButtonSkyboxID->setEnabled(checked);
    this->on_radioButtonColorID_toggled(checked && ui->radioButtonColorID->isChecked());
    this->on_radioButtonSkyboxID_toggled(checked && ui->radioButtonSkyboxID->isChecked());
}

// -------------------------------------------------------

void DialogCommandChangeMapProperties::on_radioButtonColorID_toggled(bool checked)
{
    ui->panelPrimitiveColorID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeMapProperties::on_radioButtonSkyboxID_toggled(bool checked)
{
    ui->panelPrimitiveSkyboxID->setEnabled(checked);
}
