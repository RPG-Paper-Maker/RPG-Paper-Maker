/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

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
#include "systemgameovercommand.h"
#include "titlesettingkind.h"
#include "systemcheckable.h"

const QString TitleScreenGameOverDatas::JSON_IS_TITLE_BACKGROUND_IMAGE = "itbi";
const QString TitleScreenGameOverDatas::JSON_TITLE_BACKGROUND_IMAGE = "tb";
const QString TitleScreenGameOverDatas::JSON_TITLE_BACKGROUND_VIDEO = "tbv";
const QString TitleScreenGameOverDatas::JSON_TITLE_MUSIC = "tm";
const QString TitleScreenGameOverDatas::JSON_TITLE_COMMANDS = "tc";
const QString TitleScreenGameOverDatas::JSON_TITLE_SETTINGS = "ts";
const QString TitleScreenGameOverDatas::JSON_IS_GAME_OVER_BACKGROUND_IMAGE = "isGameOverBackgroundImage";
const QString TitleScreenGameOverDatas::JSON_GAME_OVER_BACKGROUND_IMAGE = "gameOverBackgroundImage";
const QString TitleScreenGameOverDatas::JSON_GAME_OVER_BACKGROUND_VIDEO = "gameOverBackgroundVideo";
const QString TitleScreenGameOverDatas::JSON_GAME_OVER_MUSIC = "gameOverMusic";
const QString TitleScreenGameOverDatas::JSON_GAME_OVER_COMMANDS = "gameOverCommands";
const bool TitleScreenGameOverDatas::DEFAULT_IS_TITLE_BACKGROUND_IMAGE = true;
const bool TitleScreenGameOverDatas::DEFAULT_IS_GAME_OVER_BACKGROUND_IMAGE = true;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

TitleScreenGameOverDatas::TitleScreenGameOverDatas() :
    m_isTitleBackgroundImage(DEFAULT_IS_TITLE_BACKGROUND_IMAGE),
    m_titleBackgroundImageID(new SuperListItem),
    m_titleBackgroundVideoID(new SuperListItem),
    m_titleMusic(new SystemPlaySong(-1, SongKind::Music)),
    m_modelTitleCommands(new QStandardItemModel),
    m_modelTitleSettings(new QStandardItemModel),
    m_isGameOverBackgroundImage(DEFAULT_IS_GAME_OVER_BACKGROUND_IMAGE),
    m_gameOverBackgroundImageID(new SuperListItem),
    m_gameOverBackgroundVideoID(new SuperListItem),
    m_gameOverMusic(new SystemPlaySong(-1, SongKind::Music)),
    m_modelGameOverCommands(new QStandardItemModel)
{

}

TitleScreenGameOverDatas::~TitleScreenGameOverDatas()
{
    delete m_titleBackgroundImageID;
    delete m_titleBackgroundVideoID;
    delete m_titleMusic;
    delete m_gameOverBackgroundImageID;
    delete m_gameOverBackgroundVideoID;
    delete m_gameOverMusic;
    SuperListItem::deleteModel(m_modelTitleCommands);
    SuperListItem::deleteModel(m_modelTitleSettings);
    SuperListItem::deleteModel(m_modelGameOverCommands);
}

bool TitleScreenGameOverDatas::isTitleBackgroundImage() const
{
    return m_isTitleBackgroundImage;
}

void TitleScreenGameOverDatas::setIsTitleBackgroundImage(bool b)
{
    m_isTitleBackgroundImage = b;
}

SuperListItem * TitleScreenGameOverDatas::titleBackgroundImageID() const
{
    return m_titleBackgroundImageID;
}

SuperListItem * TitleScreenGameOverDatas::titleBackgroundVideoID() const
{
    return m_titleBackgroundVideoID;
}

SystemPlaySong * TitleScreenGameOverDatas::titleMusic() const
{
    return m_titleMusic;
}

QStandardItemModel * TitleScreenGameOverDatas::modelTitleCommands() const
{
    return m_modelTitleCommands;
}

QStandardItemModel * TitleScreenGameOverDatas::modelTitleSettings() const
{
    return m_modelTitleSettings;
}

bool TitleScreenGameOverDatas::isGameOverBackgroundImage() const
{
    return m_isGameOverBackgroundImage;
}

void TitleScreenGameOverDatas::setIsGameOverBackgroundImage(bool isGameOverBackgroundImage)
{
    m_isGameOverBackgroundImage = isGameOverBackgroundImage;
}

SuperListItem * TitleScreenGameOverDatas::gameOverBackgroundImageID() const
{
    return m_gameOverBackgroundImageID;
}

SuperListItem * TitleScreenGameOverDatas::gameOverBackgroundVideoID() const
{
    return m_gameOverBackgroundVideoID;
}

SystemPlaySong * TitleScreenGameOverDatas::gameOverMusic() const
{
    return m_gameOverMusic;
}

QStandardItemModel * TitleScreenGameOverDatas::modelGameOverCommands() const
{
    return m_modelGameOverCommands;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void TitleScreenGameOverDatas::read(QString path)
{
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_TITLE_SCREEN_GAME_OVER), *this);
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::setDefault()
{
    this->setDefaultTitle();
    this->setDefaultTitleCommands();
    this->setDefaultTitleSettings();
    this->setDefaultGameOver();
    this->setDefaultGameOverCommands();
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::setDefaultTitle()
{
    m_titleBackgroundImageID->setId(1);
    m_titleBackgroundVideoID->setId(-1);
    m_titleMusic->setId(1);
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::setDefaultTitleCommands()
{
    SuperListItem::deleteModel(m_modelTitleCommands, false);
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, RPM::translate(
        Translations::NEW_GAME), TitleCommandKind::NewGame))->getModelRow());
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, RPM::translate(
        Translations::LOAD_GAME), TitleCommandKind::LoadGame))->getModelRow());
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, RPM::translate(
        Translations::SETTINGS), TitleCommandKind::Settings))->getModelRow());
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, RPM::translate(
        Translations::EXIT), TitleCommandKind::Exit))->getModelRow());
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::setDefaultTitleSettings()
{
    SuperListItem::deleteModel(m_modelTitleSettings, false);
    this->addTitleSetting(TitleSettingKind::KeyboardAssignment);
    this->addTitleSetting(TitleSettingKind::Language);
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::addTitleSetting(TitleSettingKind kind)
{
    int index = static_cast<int>(kind);
    SystemCheckable *super = new SystemCheckable(index, RPM::ENUM_TO_STRING_TITLE_SETTINGS
        .at(index));
    super->setDisplayID(false);
    m_modelTitleSettings->appendRow(super->getModelRow());
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::setDefaultGameOver()
{
    m_gameOverBackgroundImageID->setId(1);
    m_gameOverBackgroundVideoID->setId(-1);
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::setDefaultGameOverCommands()
{
    SuperListItem::deleteModel(m_modelGameOverCommands, false);
    m_modelGameOverCommands->appendRow((new SystemGameOverCommand(-1, RPM
        ::translate(Translations::CONTINUE), GameOverCommandKind::Continue))
        ->getModelRow());
    m_modelGameOverCommands->appendRow((new SystemGameOverCommand(-1, RPM
        ::translate(Translations::TITLE_SCREEN), GameOverCommandKind::TitleScreen))
        ->getModelRow());
    m_modelGameOverCommands->appendRow((new SystemGameOverCommand(-1, RPM
        ::translate(Translations::EXIT), GameOverCommandKind::Exit))->getModelRow());
}

void TitleScreenGameOverDatas::setDefaultTranslations()
{
    SuperListItem::setModelItemName(m_modelTitleCommands, 0, RPM::translate(Translations::NEW_GAME));
    SuperListItem::setModelItemName(m_modelTitleCommands, 1, RPM::translate(Translations::LOAD_GAME));
    SuperListItem::setModelItemName(m_modelTitleCommands, 2, RPM::translate(Translations::SETTINGS));
    SuperListItem::setModelItemName(m_modelTitleCommands, 3, RPM::translate(Translations::EXIT));
    SuperListItem::setModelItemName(m_modelGameOverCommands, 0, RPM::translate(Translations::CONTINUE));
    SuperListItem::setModelItemName(m_modelGameOverCommands, 1, RPM::translate(Translations::TITLE_SCREEN));
    SuperListItem::setModelItemName(m_modelGameOverCommands, 2, RPM::translate(Translations::EXIT));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void TitleScreenGameOverDatas::read(const QJsonObject &json)
{
    // Clear
    SuperListItem::deleteModel(m_modelTitleCommands, false);
    SuperListItem::deleteModel(m_modelTitleSettings, false);
    SuperListItem::deleteModel(m_modelGameOverCommands, false);

    // Title screen
    if (json.contains(JSON_IS_TITLE_BACKGROUND_IMAGE))
    {
        m_isTitleBackgroundImage = json[JSON_IS_TITLE_BACKGROUND_IMAGE].toBool();
    } else {
        m_isTitleBackgroundImage = true;
    }
    if (json.contains(JSON_TITLE_BACKGROUND_IMAGE))
    {
        m_titleBackgroundImageID->setId(json[JSON_TITLE_BACKGROUND_IMAGE].toInt());
    } else
    {
        m_titleBackgroundImageID->reset();
    }
    if (json.contains(JSON_TITLE_BACKGROUND_VIDEO))
    {
        m_titleBackgroundVideoID->setId(json[JSON_TITLE_BACKGROUND_VIDEO].toInt());
    } else {
        m_titleBackgroundVideoID->reset();
    }
    m_titleMusic->read(json[JSON_TITLE_MUSIC].toObject());
    SuperListItem::readTree(m_modelTitleCommands, new SystemTitleCommand, json,
        JSON_TITLE_COMMANDS);
    SystemCheckable *super = new SystemCheckable;
    super->setDisplayID(false);
    SuperListItem::readList(m_modelTitleSettings, super, json, JSON_TITLE_SETTINGS);

    // Game over
    if (json.contains(JSON_IS_GAME_OVER_BACKGROUND_IMAGE))
    {
        m_isGameOverBackgroundImage = json[JSON_IS_GAME_OVER_BACKGROUND_IMAGE].toBool();
    } else {
        m_isGameOverBackgroundImage = true;
    }
    if (json.contains(JSON_GAME_OVER_BACKGROUND_IMAGE))
    {
        m_gameOverBackgroundImageID->setId(json[JSON_GAME_OVER_BACKGROUND_IMAGE].toInt());
    } else
    {
        m_gameOverBackgroundImageID->reset();
    }
    if (json.contains(JSON_GAME_OVER_BACKGROUND_VIDEO))
    {
        m_gameOverBackgroundVideoID->setId(json[JSON_GAME_OVER_BACKGROUND_VIDEO].toInt());
    } else {
        m_gameOverBackgroundVideoID->reset();
    }
    m_gameOverMusic->read(json[JSON_GAME_OVER_MUSIC].toObject());
    SuperListItem::readTree(m_modelGameOverCommands, new SystemGameOverCommand,
        json, JSON_GAME_OVER_COMMANDS);
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::write(QJsonObject &json) const {
    QStandardItem *item;
    QJsonArray tab;
    QJsonObject obj;
    int i, l;

    // Title screen
    if (m_isTitleBackgroundImage)
    {
        m_titleBackgroundVideoID->reset();
        if (!m_titleBackgroundImageID->isDefault())
        {
            json[JSON_TITLE_BACKGROUND_IMAGE] = m_titleBackgroundImageID->id();
        }
    } else
    {
        m_titleBackgroundImageID->reset();
        json[JSON_IS_TITLE_BACKGROUND_IMAGE] = m_isTitleBackgroundImage;
        if (m_titleBackgroundVideoID->id() != -1)
        {
            json[JSON_TITLE_BACKGROUND_VIDEO] = m_titleBackgroundVideoID->id();
        }
    }
    obj = QJsonObject();
    m_titleMusic->write(obj);
    json[JSON_TITLE_MUSIC] = obj;
    SuperListItem::writeTree(m_modelTitleCommands, json, JSON_TITLE_COMMANDS);
    SystemCheckable *super;
    for (i = 0, l = m_modelTitleSettings->invisibleRootItem()->rowCount(); i < l; i++)
    {
        item = m_modelTitleSettings->item(i);
        super = reinterpret_cast<SystemCheckable *>(item->data().value<quintptr>());
        super->setChecked(item->checkState() == Qt::Checked);
    }
    SuperListItem::writeList(m_modelTitleSettings, json, JSON_TITLE_SETTINGS);

    // Game over
    if (m_isGameOverBackgroundImage)
    {
        m_gameOverBackgroundVideoID->reset();
        if (!m_gameOverBackgroundImageID->isDefault())
        {
            json[JSON_GAME_OVER_BACKGROUND_IMAGE] = m_gameOverBackgroundImageID->id();
        }
    } else
    {
        m_gameOverBackgroundImageID->reset();
        json[JSON_IS_GAME_OVER_BACKGROUND_IMAGE] = m_isGameOverBackgroundImage;
        if (m_gameOverBackgroundVideoID->id() != -1)
        {
            json[JSON_GAME_OVER_BACKGROUND_VIDEO] = m_gameOverBackgroundVideoID->id();
        }
    }
    obj = QJsonObject();
    m_gameOverMusic->write(obj);
    json[JSON_GAME_OVER_MUSIC] = obj;
    SuperListItem::writeTree(m_modelGameOverCommands, json, JSON_GAME_OVER_COMMANDS);
}
