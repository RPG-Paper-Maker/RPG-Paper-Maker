/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "titlescreengameoverdatas.h"
#include "rpm.h"
#include "common.h"
#include "systemtitlecommand.h"
#include "titlesettingkind.h"

const QString TitleScreenGameOverDatas::JSON_IS_TITLE_BACKGROUND_IMAGE = "itbi";
const QString TitleScreenGameOverDatas::JSON_TITLE_BACKGROUND_IMAGE = "tb";
const QString TitleScreenGameOverDatas::JSON_TITLE_BACKGROUND_VIDEO = "tbv";
const QString TitleScreenGameOverDatas::JSON_TITLE_MUSIC = "tm";
const QString TitleScreenGameOverDatas::JSON_TITLE_COMMANDS = "tc";
const QString TitleScreenGameOverDatas::JSON_TITLE_SETTINGS = "ts";
const QString TitleScreenGameOverDatas::JSON_TITLE_SETTINGS_ON = "tso";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

TitleScreenGameOverDatas::TitleScreenGameOverDatas() :
    m_isBackgroundImage(true),
    m_titleBackgroundImageID(new SuperListItem),
    m_titleBackgroundVideoID(new SuperListItem),
    m_titleMusic(new SystemPlaySong(-1, SongKind::Music)),
    m_modelTitleCommands(new QStandardItemModel),
    m_modelTitleSettings(new QStandardItemModel)
{

}

TitleScreenGameOverDatas::~TitleScreenGameOverDatas() {
    delete m_titleBackgroundImageID;
    delete m_titleBackgroundVideoID;
    delete m_titleMusic;
    SuperListItem::deleteModel(m_modelTitleCommands);
    SuperListItem::deleteModel(m_modelTitleSettings);
}

bool TitleScreenGameOverDatas::isBackgroundImage() const {
    return m_isBackgroundImage;
}

void TitleScreenGameOverDatas::setIsBackgroundImage(bool b) {
    m_isBackgroundImage = b;
}

SuperListItem * TitleScreenGameOverDatas::titleBackgroundImageID() const {
    return m_titleBackgroundImageID;
}

SuperListItem * TitleScreenGameOverDatas::titleBackgroundVideoID() const {
    return m_titleBackgroundVideoID;
}

SystemPlaySong * TitleScreenGameOverDatas::titleMusic() const {
    return m_titleMusic;
}

QStandardItemModel * TitleScreenGameOverDatas::modelTitleCommands() const {
    return m_modelTitleCommands;
}

QStandardItemModel * TitleScreenGameOverDatas::modelTitleSettings() const {
    return m_modelTitleSettings;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void TitleScreenGameOverDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_TITLE_SCREEN_GAME_OVER),
        *this);
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::setDefault() {
    QStandardItem *item;
    SuperListItem *super;

    m_titleBackgroundImageID->setId(1);
    m_titleBackgroundVideoID->setId(-1);
    m_titleMusic->setId(1);
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, new
        LangsTranslation("New game"), TitleCommandKind::NewGame))->getModelRow());
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, new
        LangsTranslation("Load game"), TitleCommandKind::LoadGame))->getModelRow());
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, new
        LangsTranslation("Settings"), TitleCommandKind::Settings))->getModelRow());
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, new
        LangsTranslation("Exit"), TitleCommandKind::Exit))->getModelRow());
    item = new QStandardItem;
    super = new SuperListItem(0, RPM::ENUM_TO_STRING_TITLE_SETTINGS.at(
        static_cast<int>(TitleSettingKind::KeyboardAssignment)));
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(super->toStringName());
    item->setCheckable(true);
    item->setCheckState(Qt::Checked);
    m_modelTitleSettings->appendRow(item);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void TitleScreenGameOverDatas::read(const QJsonObject &json) {
    QStandardItem *item;
    SuperListItem *super;
    QJsonArray tab;
    QJsonObject obj;
    int i, l;

    // Clear
    SuperListItem::deleteModel(m_modelTitleCommands, false);
    SuperListItem::deleteModel(m_modelTitleSettings, false);

    // Title screen
    if (json.contains(JSON_IS_TITLE_BACKGROUND_IMAGE)) {
        m_isBackgroundImage = json[JSON_IS_TITLE_BACKGROUND_IMAGE].toBool();
    } else {
        m_isBackgroundImage = true;
    }
    if (json.contains(JSON_TITLE_BACKGROUND_IMAGE)) {
        m_titleBackgroundImageID->setId(json[JSON_TITLE_BACKGROUND_IMAGE].toInt());
    } else {
        m_titleBackgroundImageID->reset();
    }
    if (json.contains(JSON_TITLE_BACKGROUND_VIDEO)) {
        m_titleBackgroundVideoID->setId(json[JSON_TITLE_BACKGROUND_VIDEO].toInt());
    } else {
        m_titleBackgroundVideoID->reset();
    }
    m_titleMusic->read(json[JSON_TITLE_MUSIC].toObject());
    SuperListItem::readTree(m_modelTitleCommands, new SystemTitleCommand, json,
        JSON_TITLE_COMMANDS);
    tab = json[JSON_TITLE_SETTINGS].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        obj = tab.at(i).toObject();
        super = new SuperListItem;
        super->read(obj);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(super->toStringName());
        item->setCheckable(true);
        if (obj[JSON_TITLE_SETTINGS_ON].toBool()) {
            item->setCheckState(Qt::Checked);
        }
        m_modelTitleSettings->appendRow(item);
    }
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::write(QJsonObject &json) const {
    QStandardItem *item;
    QJsonArray tab;
    QJsonObject obj;
    int i, l;

    if (m_isBackgroundImage) {
        m_titleBackgroundVideoID->reset();
        if (!m_titleBackgroundImageID->isDefault()) {
            json[JSON_TITLE_BACKGROUND_IMAGE] = m_titleBackgroundImageID->id();
        }
    } else {
        m_titleBackgroundImageID->reset();
        json[JSON_IS_TITLE_BACKGROUND_IMAGE] = m_isBackgroundImage;
        if (m_titleBackgroundVideoID->id() != -1) {
            json[JSON_TITLE_BACKGROUND_VIDEO] = m_titleBackgroundVideoID->id();
        }
    }
    obj = QJsonObject();
    m_titleMusic->write(obj);
    json[JSON_TITLE_MUSIC] = obj;
    SuperListItem::writeTree(m_modelTitleCommands, json, JSON_TITLE_COMMANDS);
    for (i = 0, l = m_modelTitleSettings->invisibleRootItem()->rowCount(); i < l
         ; i++)
    {
        obj = QJsonObject();
        item = m_modelTitleSettings->item(i);
        reinterpret_cast<SuperListItem *>(item->data().value<quintptr>())->write
            (obj);
        if (item->checkState() == Qt::Checked) {
            obj[JSON_TITLE_SETTINGS_ON] = true;
        }
        tab.append(obj);
    }
    json[JSON_TITLE_SETTINGS] = tab;
}
