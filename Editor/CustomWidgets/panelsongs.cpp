/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDirIterator>
#include <QFileDialog>
#include <QMessageBox>
#include "panelsongs.h"
#include "ui_panelsongs.h"
#include "dialogimportdlcs.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelSongs::PanelSongs(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelSongs),
    m_songKind(SongKind::None),
    m_song(nullptr),
    m_mediaPlayerMusic(&m_mediaPlayerMusic1),
    m_mediaPlayerBackgroundSound(&m_mediaPlayerBackgroundSound1),
    m_mediaPlayerSound(&m_mediaPlayerSound1),
    m_mediaPlayerMusicEffect(&m_mediaPlayerMusicEffect1),
    m_mediaPlayerMusicTemp(&m_mediaPlayerMusic2),
    m_mediaPlayerBackgroundSoundTemp(&m_mediaPlayerBackgroundSound2),
    m_mediaPlayerSoundTemp(&m_mediaPlayerSound2),
    m_mediaPlayerMusicEffectTemp(&m_mediaPlayerMusicEffect2),
    m_playedMusic(nullptr),
    m_playedBackgoundSound(nullptr),
    m_needRestartMusic(false),
    m_areNegIDsEnabled(true)
{
    ui->setupUi(this);

    ui->widgetPanelIDs->showButtonMax(false);
    ui->widgetPanelIDs->list()->setCanBrutRemove(true);
    ui->widgetPanelIDs->list()->setHasContextMenu(false);
    connect(ui->checkBoxContent, SIGNAL(toggled(bool)), this, SLOT(
        showAvailableContent(bool)));

    // Available content
    ui->treeViewAvailableContent->initializeModel(new QStandardItemModel);
    ui->treeViewAvailableContent->setHasContextMenu(false);
    ui->treeViewAvailableContent->setCanBeControled(false);
    ui->treeViewAvailableContent->setCanMove(false);
    ui->treeViewAvailableContent->setUpdateId(true);

    // Start and end init
    m_startBool[SongKind::Music] = false;
    m_startBool[SongKind::BackgroundSound] = false;
    m_startBool[SongKind::Sound] = false;
    m_startBool[SongKind::MusicEffect] = false;
    m_start[SongKind::Music] = 0;
    m_start[SongKind::BackgroundSound] = 0;
    m_start[SongKind::Sound] = 0;
    m_start[SongKind::MusicEffect] = 0;
    m_endBool[SongKind::Music] = false;
    m_endBool[SongKind::BackgroundSound] = false;
    m_endBool[SongKind::Sound] = false;
    m_endBool[SongKind::MusicEffect] = false;
    m_end[SongKind::Music] = 0;
    m_end[SongKind::BackgroundSound] = 0;
    m_end[SongKind::Sound] = 0;
    m_end[SongKind::MusicEffect] = 0;

    // Connections
    connect(ui->treeViewAvailableContent, SIGNAL(deletingItem(SuperListItem *,
        int)), this, SLOT(deletingContent(SuperListItem *, int)));
    connect(ui->treeViewAvailableContent, SIGNAL(doubleClicked(QModelIndex)),
        this, SLOT(on_treeViewAvailableContentDoubleClicked(QModelIndex)));
    connect(ui->widgetPanelIDs->list(), SIGNAL(tryingEdit()), this, SLOT(
        on_widgetPanelIDPressEnter()));
    connect(ui->treeViewAvailableContent, SIGNAL(tryingEdit()), this, SLOT(
        on_treeViewAvailableContentPressEnter()));
    connect(m_mediaPlayerMusic, SIGNAL(mediaStatusChanged(
        QMediaPlayer::MediaStatus)), this, SLOT(on_mediaStatusChanged(
        QMediaPlayer::MediaStatus)));
    connect(m_mediaPlayerBackgroundSound, SIGNAL(mediaStatusChanged(
        QMediaPlayer::MediaStatus)), this, SLOT(on_mediaStatusBackgroundChanged(
        QMediaPlayer::MediaStatus)));
    connect(m_mediaPlayerMusicEffect, SIGNAL(mediaStatusChanged(
        QMediaPlayer::MediaStatus)), this, SLOT(on_mediaStatusMusicEffectChanged(
        QMediaPlayer::MediaStatus)));
    connect(m_mediaPlayerMusicTemp, SIGNAL(mediaStatusChanged(
        QMediaPlayer::MediaStatus)), this, SLOT(on_mediaStatusChanged(
        QMediaPlayer::MediaStatus)));
    connect(m_mediaPlayerBackgroundSoundTemp, SIGNAL(mediaStatusChanged(
        QMediaPlayer::MediaStatus)), this, SLOT(on_mediaStatusBackgroundChanged(
        QMediaPlayer::MediaStatus)));
    connect(m_mediaPlayerMusicEffectTemp, SIGNAL(mediaStatusChanged(
        QMediaPlayer::MediaStatus)), this, SLOT(on_mediaStatusMusicEffectChanged(
        QMediaPlayer::MediaStatus)));
    connect(m_mediaPlayerMusic, SIGNAL(positionChanged(qint64)), this, SLOT(
        positionMusicChanged(qint64)));
    connect(m_mediaPlayerMusicTemp, SIGNAL(positionChanged(qint64)), this, SLOT(
        positionMusicChanged(qint64)));
    connect(m_mediaPlayerBackgroundSound, SIGNAL(positionChanged(qint64)), this,
        SLOT(positionBackgroundSoundChanged(qint64)));
    connect(m_mediaPlayerBackgroundSoundTemp, SIGNAL(positionChanged(qint64)),
        this, SLOT(positionBackgroundSoundChanged(qint64)));
    connect(m_mediaPlayerSound, SIGNAL(positionChanged(qint64)), this, SLOT(
        positionSoundChanged(qint64)));
    connect(m_mediaPlayerSoundTemp, SIGNAL(positionChanged(qint64)), this,
        SLOT(positionSoundChanged(qint64)));
    connect(m_mediaPlayerMusicEffect, SIGNAL(positionChanged(qint64)), this,
        SLOT(positionMusicEffectChanged(qint64)));
    connect(m_mediaPlayerMusicEffectTemp, SIGNAL(positionChanged(qint64)), this,
        SLOT(positionMusicEffectChanged(qint64)));
    connect(ui->panelPrimitiveValueVolume->spinBoxNumber(), SIGNAL(valueChanged(
        int)), this, SLOT(on_spinBoxVolumeValueChanged(int)));
    connect(ui->panelPrimitiveValueStart->doubleSpinBoxNumber(), SIGNAL(
        valueChanged(double)), this, SLOT(on_doubleSpinBoxStartValueChanged(
        double)));
    connect(ui->panelPrimitiveValueEnd->doubleSpinBoxNumber(), SIGNAL(
        valueChanged(double)), this, SLOT(on_doubleSpinBoxEndValueChanged(double)));

    this->translate();
}

PanelSongs::~PanelSongs()
{
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel());
    delete ui;
}

SystemSong* PanelSongs::song() const {
    return m_song;
}

void PanelSongs::setSong(SystemSong *song) {
    m_song = song;
}

void PanelSongs::setAreNegIDsEnabled(bool b) {
    m_areNegIDsEnabled = b;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelSongs::initializePrimitives(QStandardItemModel *parameters,
    QStandardItemModel *properties)
{
    ui->panelPrimitiveValueVolume->initializeNumber(parameters, properties);
    ui->panelPrimitiveValueVolume->setNumberValue(100);
    ui->panelPrimitiveValueStart->initializeNumber(parameters, properties, false);
    ui->panelPrimitiveValueEnd->initializeNumber(parameters, properties, false);
}

// -------------------------------------------------------

void PanelSongs::setSongKind(SongKind kind) {
    bool isNone = kind == SongKind::None;
    m_songKind = kind;

    showSongs(!isNone);

    if (!isNone) {
        ui->widgetPanelIDs->list()->setAreNegIDsEnabled(m_areNegIDsEnabled);
        ui->widgetPanelIDs->initializeModel(RPM::get()->project()
            ->songsDatas()->model(kind));

        // Connection of list
        connect(ui->widgetPanelIDs->list()->selectionModel(), SIGNAL(
            currentChanged(QModelIndex,QModelIndex)), this, SLOT(
            on_listIDsIndexChanged(QModelIndex,QModelIndex)));

        QModelIndex index = ui->widgetPanelIDs->list()->getModel()->index(0, 0);
        ui->widgetPanelIDs->list()->setCurrentIndex(index);


        // Loading first available content
        loadAvailableContent(-2);

        connect(ui->treeViewAvailableContent->selectionModel(), SIGNAL(
            currentChanged(QModelIndex,QModelIndex)), this, SLOT(
            on_listIndexChanged(QModelIndex,QModelIndex)));

        // Update checkBox
        ui->checkBoxContent->setText(RPM::translate(Translations
            ::SHOW_AVAILABLE_CONTENT) + RPM::SPACE + SystemSong::getLocalFolder(
            kind));

        // Buttons & volume according to state of song
        ui->pushButtonPlay->show();
        ui->pushButtonStop->show();
        ui->pushButtonPause->show();
        ui->pushButtonPlay->setEnabled(true);
        ui->pushButtonStop->setEnabled(true);
        ui->pushButtonPause->setEnabled(true);
        setVisibleStartEnd(true);
        QMediaPlayer::State state = QMediaPlayer::StoppedState;
        int volume = 0;
        switch (m_songKind) {
        case SongKind::Music:
            state = m_mediaPlayerMusic->state();
            volume = m_mediaPlayerMusic->volume();
            break;
        case SongKind::BackgroundSound:
            state = m_mediaPlayerBackgroundSound->state();
            volume = m_mediaPlayerBackgroundSound->volume();
            break;
        case SongKind::Sound:
            state = m_mediaPlayerSound->state();
            volume = m_mediaPlayerSound->volume();
            ui->pushButtonPause->hide();
            ui->pushButtonStop->hide();
            setVisibleStartEnd(false);
            break;
        case SongKind::MusicEffect:
            state = m_mediaPlayerMusicEffect->state();
            volume = m_mediaPlayerMusicEffect->volume();
            ui->pushButtonPause->hide();
            ui->pushButtonStop->hide();
            setVisibleStartEnd(false);
            break;
        default:
            break;
        }
        switch (state) {
        case QMediaPlayer::StoppedState:
            ui->pushButtonStop->setEnabled(false);
            ui->pushButtonPause->setEnabled(false);
            break;
        case QMediaPlayer::PausedState:
            ui->pushButtonPause->setEnabled(false);
            break;
        default:
            break;
        }
        updateSong(ui->widgetPanelIDs->list()->getModel()->item(0));
        ui->horizontalSliderVolume->setValue(volume);
        ui->checkBoxStart->setChecked(m_startBool[m_songKind]);
        ui->checkBoxEnd->setChecked(m_endBool[m_songKind]);
        ui->panelPrimitiveValueStart->doubleSpinBoxNumber()->setValue(m_start[
            m_songKind] / 1000.0);
        ui->panelPrimitiveValueEnd->doubleSpinBoxNumber()->setValue(m_end[
            m_songKind] / 1000.0);
    }
}

// -------------------------------------------------------

void PanelSongs::changeSong(SystemSong *song) {
    setSong(song);

    int index = SuperListItem::getIndexById(ui->widgetPanelIDs->list()
        ->getModel()->invisibleRootItem(), song->id());
    QModelIndex indexModel = ui->widgetPanelIDs->list()->getModel()->index(
        index, 0);
    ui->widgetPanelIDs->list()->setCurrentIndex(indexModel);
}

// -------------------------------------------------------

void PanelSongs::initialize(EventCommand *command, int &i) {
    changeSong(reinterpret_cast<SystemSong *>(SuperListItem::getById(
        RPM::get()->project()->songsDatas()->model(m_songKind)
        ->invisibleRootItem(), command->valueCommandAt(i++).toInt())));
    ui->panelPrimitiveValueVolume->initializeCommand(command, i);
    ui->checkBoxStart->setChecked(command->valueCommandAt(i++) == "1");
    ui->panelPrimitiveValueStart->initializeCommand(command, i);
    ui->checkBoxEnd->setChecked(command->valueCommandAt(i++) == "1");
    ui->panelPrimitiveValueEnd->initializeCommand(command, i);
}

// -------------------------------------------------------

void PanelSongs::getCommand(QVector<QString> &command) const {
    command.append(QString::number(m_song->id()));
    ui->panelPrimitiveValueVolume->getCommand(command);
    command.append(ui->checkBoxStart->isChecked() ? "1" : "0");
    ui->panelPrimitiveValueStart->getCommand(command);
    command.append(ui->checkBoxEnd->isChecked() ? "1" : "0");
    ui->panelPrimitiveValueEnd->getCommand(command);
}

// -------------------------------------------------------

void PanelSongs::updatePlaySong(SystemPlaySong *song) {
    song->setId(song->isSelectedByID() ? -1 : m_song->id());
    song->volume()->setCopy(*ui->panelPrimitiveValueVolume->model());
    song->setIsStart(ui->checkBoxStart->isChecked());
    song->start()->setCopy(*ui->panelPrimitiveValueStart->model());
    song->setIsEnd(ui->checkBoxEnd->isChecked());
    song->end()->setCopy(*ui->panelPrimitiveValueEnd->model());
}

// -------------------------------------------------------

void PanelSongs::showSongs(bool b) {
    this->setVisible(b);
}

// -------------------------------------------------------

void PanelSongs::updateSong(QStandardItem *item) {
    if (item != nullptr) {
        m_song = reinterpret_cast<SystemSong *>(item->data().value<qintptr>());
        if (m_song != nullptr) {
            if (m_song->id() != -1) {
                QUrl path = QUrl::fromLocalFile(m_song->getPath());
                switch (m_songKind) {
                case SongKind::Music:
                    m_mediaPlayerMusicTemp->setMedia(path);
                    break;
                case SongKind::BackgroundSound:
                    m_mediaPlayerBackgroundSoundTemp->setMedia(path);
                    break;
                case SongKind::Sound:
                    m_mediaPlayerSoundTemp->setMedia(path);
                    break;
                case SongKind::MusicEffect:
                    m_mediaPlayerMusicEffectTemp->setMedia(path);
                    break;
                default:
                    break;
                }
            }
            ui->pushButtonPlay->setEnabled(m_song->id() != -1);
        }
    }
}

// -------------------------------------------------------

void PanelSongs::loadAvailableContent(int row) {
    if (row == -1) {
        QStandardItem *item = ui->treeViewAvailableContent->getSelected();
        if (item != nullptr)
            row = item->row();
    }

    // Clear
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel(), false);
    ui->treeViewAvailableContent->getModel()->clear();

    // Load content from folders
    loadContentFromFolder(SystemSong::getFolder(m_songKind));
    loadContentFromFolder(SystemSong::getFolder(m_songKind, true), true);
    DlcsDatas *datas = RPM::get()->project()->gameDatas()->dlcsDatas();
    QString dlc;
    for (int i = 0, l = datas->dlcsCount(); i < l; i++)
    {
        dlc = datas->dlcAt(i);
        loadContentFromFolder(SystemSong::getFolder(m_songKind, false, dlc
            ), false, dlc);
    }

    // Reselect index
    if (row != -1 && row != -2) {
        QModelIndex index = ui->treeViewAvailableContent->getModel()->index(row,
            0);
        ui->treeViewAvailableContent->setCurrentIndex(index);
    }
}

// -------------------------------------------------------

void PanelSongs::loadContentFromFolder(QString path, bool isBR, QString dlc) {
    QDir dir(path);
    QStringList files = dir.entryList(QDir::Files);
    QIcon icon = QIcon(isBR ? SuperListItem::pathIconBlue : (dlc.isEmpty() ?
        SuperListItem::pathIconRed : RPM::PATH_ICON_GREEN));
    QStandardItem *item;
    SystemSong *super;

    for (int i = 0; i < files.size(); i++) {
        super = new SystemSong(1, files.at(i), isBR, dlc, m_songKind);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setIcon(icon);
        item->setText(super->name());
        ui->treeViewAvailableContent->getModel()->appendRow(item);
    }
}

// -------------------------------------------------------

void PanelSongs::deleteContent(QString path) {
    if (!QFile(path).remove())
        QMessageBox::warning(this, RPM::translate(Translations::WARNING), RPM
            ::translate(Translations::COULD_NOT_DELETE_FILE_AT) + RPM::SPACE +
            path + RPM::DOT);
}

// -------------------------------------------------------

void PanelSongs::moveContent(){
    QStandardItem *selected = ui->treeViewAvailableContent->getSelected();
    SystemSong *super;

    if (selected != nullptr) {
        super = reinterpret_cast<SystemSong *>(selected->data().value<qintptr>());
        ui->widgetPanelIDs->list()->addNewItem(super);
    }
}

// -------------------------------------------------------

void PanelSongs::updateSongs() {
    m_song = reinterpret_cast<SystemSong *>(ui->widgetPanelIDs->list()
        ->getSelected()->data().value<qintptr>());
}

// -------------------------------------------------------

void PanelSongs::updateVolume(int volume) {
    switch (m_songKind) {
    case SongKind::Music:
        m_mediaPlayerMusic->setVolume(volume);
        m_mediaPlayerMusicTemp->setVolume(volume);
        break;
    case SongKind::BackgroundSound:
        m_mediaPlayerBackgroundSound->setVolume(volume);
        m_mediaPlayerBackgroundSoundTemp->setVolume(volume);
        break;
    case SongKind::Sound:
        m_mediaPlayerSound->setVolume(volume);
        m_mediaPlayerSoundTemp->setVolume(volume);
        break;
    case SongKind::MusicEffect:
        m_mediaPlayerMusicEffect->setVolume(volume);
        m_mediaPlayerMusicEffectTemp->setVolume(volume);
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void PanelSongs::stopOnEnd(int end, qint64 pos, QMediaPlayer *player) {
    if (end > 0 && pos >= end)
        player->stop();
}

// -------------------------------------------------------

void PanelSongs::setVisibleStartEnd(bool b) {
    ui->checkBoxStart->setVisible(b);
    ui->panelPrimitiveValueStart->setVisible(b);
    ui->labelSeconds1->setVisible(b);
    ui->checkBoxEnd->setVisible(b);
    ui->panelPrimitiveValueEnd->setVisible(b);
    ui->labelSeconds2->setVisible(b);
}

//-------------------------------------------------

void PanelSongs::translate()
{
    ui->labelVolume->setText(RPM::translate(Translations::VOLUME) + RPM::COLON);
    ui->checkBoxContent->setText(RPM::translate(Translations::VOLUME));
    ui->checkBoxEnd->setText(RPM::translate(Translations::END) + RPM::COLON);
    ui->checkBoxStart->setText(RPM::translate(Translations::START) + RPM::COLON);
    ui->groupBoxOptions->setTitle(RPM::translate(Translations::OPTIONS));
    ui->pushButtonRefresh->setText(RPM::translate(Translations::REFRESH));
    ui->pushButtonDLC->setText(RPM::translate(Translations::IMPORT_DLC_S) + RPM
        ::DOT_DOT_DOT);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelSongs::showAvailableContent(bool b) {
    ui->checkBoxContent->setChecked(b);
    ui->treeViewAvailableContent->setVisible(b);
    ui->pushButtonMove->setVisible(b);
    ui->pushButtonRefresh->setVisible(b);
    ui->pushButtonExport->setVisible(b);
    ui->pushButtonAdd->setVisible(b);
    RPM::get()->engineSettings()->setShowAvailableContent(b);
    RPM::get()->engineSettings()->write();
}

// -------------------------------------------------------

void PanelSongs::play() {
    if (m_song->id() == -1)
        return;

    QMediaPlayer *temp = nullptr;
    QUrl path = QUrl::fromLocalFile(m_song->getPath());
    int start = m_start[m_songKind];
    bool isStart = m_startBool[m_songKind];
    switch (m_songKind) {
    case SongKind::Music:
        m_needRestartMusic = false;
        if (m_playedMusic != m_song || m_mediaPlayerMusic->state() !=
            QMediaPlayer::PausedState)
        {
            temp = m_mediaPlayerMusic;
            m_mediaPlayerMusic = m_mediaPlayerMusicTemp;
            m_mediaPlayerMusicTemp = temp;
            if (isStart)
                m_mediaPlayerMusic->setPosition(start);
        }
        m_playedMusic = m_song;
        m_mediaPlayerMusicTemp->stop();
        m_mediaPlayerMusic->play();
        m_mediaPlayerMusicTemp->setMedia(path);
        break;
    case SongKind::BackgroundSound:
        if (m_playedBackgoundSound != m_song || m_mediaPlayerBackgroundSound
            ->state() != QMediaPlayer::PausedState)
        {
            temp = m_mediaPlayerBackgroundSound;
            m_mediaPlayerBackgroundSound = m_mediaPlayerBackgroundSoundTemp;
            m_mediaPlayerBackgroundSoundTemp = temp;
            if (isStart)
                m_mediaPlayerBackgroundSound->setPosition(start);
        }
        m_playedBackgoundSound = m_song;
        m_mediaPlayerBackgroundSoundTemp->stop();
        m_mediaPlayerBackgroundSound->play();
        m_mediaPlayerBackgroundSoundTemp->setMedia(path);
        break;
    case SongKind::Sound:
        temp = m_mediaPlayerSound;
        m_mediaPlayerSound = m_mediaPlayerSoundTemp;
        m_mediaPlayerSoundTemp = temp;
        m_mediaPlayerSoundTemp->stop();
        if (isStart)
            m_mediaPlayerSound->setPosition(start);
        m_mediaPlayerSound->play();
        m_mediaPlayerSoundTemp->setMedia(path);
        break;
    case SongKind::MusicEffect:
        m_needRestartMusic = true;
        m_mediaPlayerMusic->setVolume(0);
        QTimer::singleShot(500, this, SLOT(pauseFromMusicEffect()));
        temp = m_mediaPlayerMusicEffect;
        m_mediaPlayerMusicEffect = m_mediaPlayerMusicEffectTemp;
        m_mediaPlayerMusicEffectTemp = temp;
        m_mediaPlayerMusicEffectTemp->stop();
        if (isStart)
            m_mediaPlayerMusicEffect->setPosition(start);
        m_mediaPlayerMusicEffect->play();
        m_mediaPlayerMusicEffectTemp->setMedia(path);
        break;
    default:
        break;
    }
    ui->pushButtonStop->setEnabled(true);
    ui->pushButtonPause->setEnabled(true);
}

// -------------------------------------------------------

void PanelSongs::stop() {
    switch (m_songKind) {
    case SongKind::Music:
        m_mediaPlayerMusic->stop();
        break;
    case SongKind::BackgroundSound:
        m_mediaPlayerBackgroundSound->stop();
        break;
    default:
        break;
    }

    ui->pushButtonStop->setEnabled(false);
    ui->pushButtonPause->setEnabled(false);
}

// -------------------------------------------------------

void PanelSongs::pause() {
    switch (m_songKind) {
    case SongKind::Music:
        m_mediaPlayerMusic->pause();
        break;
    case SongKind::BackgroundSound:
        m_mediaPlayerBackgroundSound->pause();
        break;
    default:
        break;
    }

    ui->pushButtonPause->setEnabled(false);
}

// -------------------------------------------------------

void PanelSongs::fadeOut() {
    m_mediaPlayerMusic->setVolume(m_mediaPlayerMusic->volume() + 1);
    m_mediaPlayerMusicTemp->setVolume(m_mediaPlayerMusic->volume() + 1);

    if (m_mediaPlayerMusic->volume() >= ui->panelPrimitiveValueVolume->model()
        ->numberValue())
    {
        disconnect(&m_timer, SIGNAL(timeout()), this, SLOT(fadeOut()));
        m_timer.stop();
    }
}

// -------------------------------------------------------

void PanelSongs::pauseFromMusicEffect() {
    m_mediaPlayerMusic->pause();
}

// -------------------------------------------------------

void PanelSongs::on_listIDsIndexChanged(QModelIndex index, QModelIndex)
{
    updateSong(ui->widgetPanelIDs->list()->getModel()->itemFromIndex(index));
}

// -------------------------------------------------------

void PanelSongs::on_listIndexChanged(QModelIndex index, QModelIndex)
{
    updateSong(ui->treeViewAvailableContent->getModel()->itemFromIndex(index));
}

// -------------------------------------------------------

void PanelSongs::on_pushButtonMove_clicked() {
    moveContent();
}

// -------------------------------------------------------

void PanelSongs::on_pushButtonRefresh_clicked() {
    loadAvailableContent();
}

// -------------------------------------------------------

void PanelSongs::on_pushButtonAdd_clicked() {

    // Open dialog box
    QStringList files = QFileDialog::getOpenFileNames(this, RPM::translate(
        Translations::ADD_NEW_CONTENTS), "", "Music (*.mp3 *.ogg *.wav)");
    QString path;

    // Copy all the selected files
    for (int i = 0; i < files.size(); i++) {
        path = files.at(i);
        if (!QFile::copy(path, Common::pathCombine(SystemSong::getFolder(
            m_songKind, false), QFileInfo(path).fileName())))
        {
            QMessageBox::warning(this, RPM::translate(Translations::WARNING),
                RPM::translate(Translations::COULD_NOT_COPY_FILE_AT) + RPM
                ::SPACE + path + RPM::DOT);
        }
    }

    // Refresh content
    loadAvailableContent();
}

// -------------------------------------------------------

void PanelSongs::deletingContent(SuperListItem *super, int row) {
    QString path = reinterpret_cast<SystemSong *>(super)->getPath();

    // If is BR, ask if sure action before
    if (reinterpret_cast<SystemSong *>(super)->isBR()) {
        loadAvailableContent(row);
        QMessageBox::StandardButton box = QMessageBox::question(this, RPM
            ::translate(Translations::DELETING_SONG), RPM::translate(
            Translations::YOUR_TRYING_REMOVE_BR_SONG) + RPM::DOT + RPM::SPACE +
            RPM::translate(Translations::ARE_YOU_SURE_WANT_DO_IT), QMessageBox
            ::Yes | QMessageBox::No);

        if (box == QMessageBox::Yes) {
            deleteContent(path);
            loadAvailableContent();
        }
    } else
        deleteContent(path);
}

// -------------------------------------------------------

void PanelSongs::on_treeViewAvailableContentDoubleClicked(QModelIndex) {
    moveContent();
}

// -------------------------------------------------------

void PanelSongs::on_widgetPanelIDPressEnter() {
    play();
}

// -------------------------------------------------------

void PanelSongs::on_treeViewAvailableContentPressEnter() {
    play();
}

// -------------------------------------------------------

void PanelSongs::on_checkBoxStart_toggled(bool checked) {
    ui->panelPrimitiveValueStart->setEnabled(checked);
    ui->labelSeconds1->setEnabled(checked);
    m_startBool[m_songKind] = checked;
}

// -------------------------------------------------------

void PanelSongs::on_checkBoxEnd_toggled(bool checked) {
    ui->panelPrimitiveValueEnd->setEnabled(checked);
    ui->labelSeconds2->setEnabled(checked);
    m_endBool[m_songKind] = checked;
}

// -------------------------------------------------------

void PanelSongs::on_spinBoxVolumeValueChanged(int value) {
    ui->horizontalSliderVolume->setValue(value);
    updateVolume(value);
}

// -------------------------------------------------------

void PanelSongs::on_doubleSpinBoxStartValueChanged(double value) {
    m_start[m_songKind] = static_cast<int>(value * 1000);
}

// -------------------------------------------------------

void PanelSongs::on_doubleSpinBoxEndValueChanged(double value) {
    m_end[m_songKind] = static_cast<int>(value * 1000);
}

// -------------------------------------------------------

void PanelSongs::on_horizontalSliderVolume_valueChanged(int value) {
    ui->panelPrimitiveValueVolume->setNumberValue(value);
    updateVolume(value);
}

// -------------------------------------------------------

void PanelSongs::on_pushButtonPlay_clicked() {
    play();
}

// -------------------------------------------------------

void PanelSongs::on_pushButtonStop_clicked() {
    stop();
}

// -------------------------------------------------------

void PanelSongs::on_pushButtonPause_clicked() {
    pause();
}

// -------------------------------------------------------

void PanelSongs::on_mediaStatusChanged(QMediaPlayer::MediaStatus) {
    if (m_mediaPlayerMusic->mediaStatus() == QMediaPlayer::EndOfMedia)
        m_mediaPlayerMusic->play();
}

// -------------------------------------------------------

void PanelSongs::on_mediaStatusBackgroundChanged(QMediaPlayer::MediaStatus)
{
    if (m_mediaPlayerBackgroundSound->mediaStatus() == QMediaPlayer::EndOfMedia)
    {
        m_mediaPlayerBackgroundSound->play();
    }
}


// -------------------------------------------------------

void PanelSongs::on_mediaStatusMusicEffectChanged(QMediaPlayer::MediaStatus)
{
    if (m_mediaPlayerMusicEffect->mediaStatus() == QMediaPlayer::EndOfMedia &&
        m_needRestartMusic)
    {
        m_mediaPlayerMusic->play();
        connect(&m_timer, SIGNAL(timeout()), this, SLOT(fadeOut()));
        m_timer.start(10);
        m_needRestartMusic = false;
    }
}

// -------------------------------------------------------

void PanelSongs::positionMusicChanged(qint64 pos) {
    stopOnEnd(m_end[SongKind::Music], pos, m_mediaPlayerMusic);
}

// -------------------------------------------------------

void PanelSongs::positionBackgroundSoundChanged(qint64 pos) {
    stopOnEnd(m_end[SongKind::BackgroundSound], pos,
              m_mediaPlayerBackgroundSound);
}

// -------------------------------------------------------

void PanelSongs::positionSoundChanged(qint64 pos) {
    stopOnEnd(m_end[SongKind::Sound], pos, m_mediaPlayerSound);
}

// -------------------------------------------------------

void PanelSongs::positionMusicEffectChanged(qint64 pos) {
    stopOnEnd(m_end[SongKind::MusicEffect], pos, m_mediaPlayerMusicEffect);
}

// -------------------------------------------------------

void PanelSongs::on_pushButtonDLC_clicked()
{
    DialogImportDLCs dialog;
    if (dialog.exec() == QDialog::Accepted) {
        RPM::get()->project()->writeDlcs();
        loadAvailableContent(0);
    } else
    {
        RPM::get()->project()->readDlcs();
    }
}

// -------------------------------------------------------

void PanelSongs::on_pushButtonExport_clicked()
{
    QStandardItem *selected = ui->treeViewAvailableContent->getSelected();
    if (selected != nullptr)
    {
        QString folder = QFileDialog::getExistingDirectory(this, RPM::translate(
            Translations::CHOOSE_LOCATION) + RPM::DOT_DOT_DOT);
        SystemPicture *picture = reinterpret_cast<SystemPicture *>(selected
            ->data().value<quintptr>());
        if (!folder.isEmpty())
        {
            Common::copyPath(picture->getPath(), Common::pathCombine(folder,
                picture->name()));
        }
    }
}
