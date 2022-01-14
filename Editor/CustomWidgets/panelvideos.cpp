/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDir>
#include <QMessageBox>
#include <QFileDialog>
#include <QGraphicsVideoItem>
#include "panelvideos.h"
#include "ui_panelvideos.h"
#include "dialogimportdlcs.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelVideos::PanelVideos(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelVideos),
    m_video(nullptr),
    m_areNegIDsEnabled(true),
    m_isOutput(false)
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

    // Connections
    connect(ui->treeViewAvailableContent, SIGNAL(deletingItem(SuperListItem *,
        int)), this, SLOT(deletingContent(SuperListItem *, int)));
    connect(ui->treeViewAvailableContent, SIGNAL(doubleClicked(QModelIndex)),
        this, SLOT(on_treeViewAvailableContentDoubleClicked(QModelIndex)));

    this->translate();
}

PanelVideos::~PanelVideos()
{
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel());
    delete ui;

    delete m_player;
}


SuperListItem *PanelVideos::video() const {
    return m_video;
}

void PanelVideos::setVideo(SuperListItem *video) {
    m_video = video;
}

void PanelVideos::setAreNegIDsEnabled(bool b) {
    m_areNegIDsEnabled = b;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelVideos::setKind() {
    ui->widgetPanelIDs->list()->setAreNegIDsEnabled(m_areNegIDsEnabled);
    ui->widgetPanelIDs->initializeModel(RPM::get()->project()->videosDatas()
        ->model());

    // Connection of list
    connect(ui->widgetPanelIDs->list()->selectionModel(), SIGNAL(currentChanged(
        QModelIndex, QModelIndex)), this, SLOT(on_listIDsIndexChanged(
        QModelIndex,QModelIndex)));

    QModelIndex index = ui->widgetPanelIDs->list()->getModel()->index(0, 0);
    ui->widgetPanelIDs->list()->setCurrentIndex(index);

    // Loading first available content
    loadAvailableContent(-2);

    connect(ui->treeViewAvailableContent->selectionModel(), SIGNAL(
        currentChanged(QModelIndex,QModelIndex)), this, SLOT(on_listIndexChanged
        (QModelIndex,QModelIndex)));

    // Update checkBox
    ui->checkBoxContent->setText(RPM::translate(Translations
        ::SHOW_AVAILABLE_CONTENT) + RPM::SPACE + SystemVideo::getLocalFolder());

    // Player config
    m_player = new QMediaPlayer;
}

// -------------------------------------------------------

void PanelVideos::changeVideo(SuperListItem *video) {
    this->setVideo(video);

    int index = SuperListItem::getIndexById(ui->widgetPanelIDs->list()
        ->getModel()->invisibleRootItem(), video->id());
    QModelIndex indexModel = ui->widgetPanelIDs->list()->getModel()->index(
        index, 0);
    ui->widgetPanelIDs->list()->setCurrentIndex(indexModel);
}

// -------------------------------------------------------

void PanelVideos::updateVideo(QStandardItem *item) {
    SystemVideo *video;

    if (m_isOutput) {
        this->on_pushButtonStop_clicked();
    }
    if (item != nullptr) {
        video = reinterpret_cast<SystemVideo *>(item->data().value<qintptr>());
        if (m_video != nullptr) {
            m_video->setId(video->id());
            m_video->setName(video->name());
        }
        if (video->id() != -1) {
            m_player->setMedia(QUrl::fromLocalFile(video->getPath()));
        }
        ui->pushButtonPlay->setEnabled(video->id() != -1);
    }
}

// -------------------------------------------------------

void PanelVideos::loadAvailableContent(int row) {
    if (row == -1) {
        QStandardItem *item = ui->treeViewAvailableContent->getSelected();
        if (item != nullptr)
            row = item->row();
    }

    // Clear
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel(), false);
    ui->treeViewAvailableContent->getModel()->clear();

    // Load content from folders
    loadContentFromFolder(SystemVideo::getFolder());
    loadContentFromFolder(SystemVideo::getFolder(true), true);
    DlcsDatas *datas = RPM::get()->project()->gameDatas()->dlcsDatas();
    QString dlc;
    for (int i = 0, l = datas->dlcsCount(); i < l; i++)
    {
        dlc = datas->dlcAt(i);
        loadContentFromFolder(SystemVideo::getFolder(false, dlc), false, dlc);
    }

    // Reselect index
    if (row != -1 && row != -2) {
        QModelIndex index = ui->treeViewAvailableContent->getModel()->index(row,
            0);
        ui->treeViewAvailableContent->setCurrentIndex(index);
    }
}

// -------------------------------------------------------

void PanelVideos::loadContentFromFolder(QString path, bool isBR, QString dlc) {
    QDir dir(path);
    QStringList files = dir.entryList(QDir::Files);
    QIcon icon = QIcon(isBR ? SuperListItem::pathIconBlue : (dlc.isEmpty() ?
        SuperListItem::pathIconRed : RPM::PATH_ICON_GREEN));
    QStandardItem *item;
    SystemVideo *super;

    for (int i = 0; i < files.size(); i++) {
        super = new SystemVideo(1, files.at(i), isBR, dlc);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setIcon(icon);
        item->setText(super->name());
        ui->treeViewAvailableContent->getModel()->appendRow(item);
    }
}

// -------------------------------------------------------

void PanelVideos::deleteContent(QString path) {
    if (!QFile(path).remove()) {
        QMessageBox::warning(this, RPM::translate(Translations::WARNING), RPM
            ::translate(Translations::COULD_NOT_DELETE_FILE_AT) + RPM::SPACE +
            path + RPM::DOT);
    }
}

// -------------------------------------------------------

void PanelVideos::moveContent(){
    QStandardItem *selected = ui->treeViewAvailableContent->getSelected();
    SystemSong *super;

    if (selected != nullptr) {
        super = reinterpret_cast<SystemSong *>(selected->data().value<qintptr>());
        ui->widgetPanelIDs->list()->addNewItem(super);
    }
}

// -------------------------------------------------------

void PanelVideos::updateVideos() {
    m_video = reinterpret_cast<SystemVideo *>(ui->widgetPanelIDs->list()
        ->getSelected()->data().value<qintptr>());
}

//-------------------------------------------------

void PanelVideos::dropFiles(QStringList &files)
{
    QString path;

    // Copy all the selected files
    for (int i = 0; i < files.size(); i++) {
        path = files.at(i);
        if (!QFile::copy(path, Common::pathCombine(SystemVideo::getFolder(false)
            , QFileInfo(path).fileName())))
        {
            QMessageBox::warning(this, RPM::translate(Translations::WARNING),
                RPM::translate(Translations::COULD_NOT_COPY_FILE_AT) + RPM
                ::SPACE + path + RPM::DOT);
        }
    }

    // Refresh content
    loadAvailableContent();
}

//-------------------------------------------------

void PanelVideos::translate()
{
    ui->checkBoxContent->setText(RPM::translate(Translations
        ::SHOW_AVAILABLE_CONTENT));
    ui->pushButtonRefresh->setText(RPM::translate(Translations::REFRESH));
    ui->pushButtonExport->setText(RPM::translate(Translations::EXPORT) + RPM
        ::DOT_DOT_DOT);
    ui->pushButtonDLC->setText(RPM::translate(Translations::IMPORT_DLC_S) + RPM
        ::DOT_DOT_DOT);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelVideos::showAvailableContent(bool b) {
    ui->checkBoxContent->setChecked(b);
    ui->treeViewAvailableContent->setVisible(b);
    ui->pushButtonDelete->setVisible(b);
    ui->pushButtonMove->setVisible(b);
    ui->pushButtonRefresh->setVisible(b);
    ui->pushButtonExport->setVisible(b);
    ui->pushButtonAdd->setVisible(b);
    RPM::get()->engineSettings()->setShowAvailableContent(b);
    RPM::get()->engineSettings()->write();
}

// -------------------------------------------------------

void PanelVideos::on_listIDsIndexChanged(QModelIndex index, QModelIndex)
{
    updateVideo(ui->widgetPanelIDs->list()->getModel()->itemFromIndex(index));
}

// -------------------------------------------------------

void PanelVideos::on_listIndexChanged(QModelIndex index, QModelIndex)
{
    updateVideo(ui->treeViewAvailableContent->getModel()->itemFromIndex(index));
}

// -------------------------------------------------------

void PanelVideos::on_pushButtonMove_clicked() {
    moveContent();
}

// -------------------------------------------------------

void PanelVideos::on_pushButtonRefresh_clicked() {
    loadAvailableContent();
}

// -------------------------------------------------------

void PanelVideos::on_pushButtonDelete_clicked()
{
    ui->widgetPanelIDs->list()->contextDelete();
}

// -------------------------------------------------------

void PanelVideos::on_pushButtonAdd_clicked()
{
    QStringList files = QFileDialog::getOpenFileNames(this, RPM::translate(
        Translations::ADD_NEW_CONTENTS), "", "Videos (*.mp4 *.ogv, *.avi)");
    this->dropFiles(files);
}

// -------------------------------------------------------

void PanelVideos::deletingContent(SuperListItem *super, int row) {
    QString path = reinterpret_cast<SystemVideo *>(super)->getPath();

    // If is BR, ask if sure action before
    if (reinterpret_cast<SystemSong *>(super)->isBR()) {
        loadAvailableContent(row);
        QMessageBox box(QMessageBox::Question, RPM::translate(Translations
            ::DELETING_VIDEO), RPM::translate(Translations::YOUR_TRYING_REMOVE_BR_VIDEO)
            + RPM::DOT + RPM::SPACE + RPM::translate(Translations::ARE_YOU_SURE_WANT_DO_IT),
            QMessageBox::Yes | QMessageBox::No);
        box.setButtonText(QMessageBox::Yes, RPM::translate(Translations::YES));
        box.setButtonText(QMessageBox::No, RPM::translate(Translations::NO));
        if (box.exec() == QMessageBox::Yes) {
            deleteContent(path);
            loadAvailableContent();
        }
    } else
        deleteContent(path);
}

// -------------------------------------------------------

void PanelVideos::on_treeViewAvailableContentDoubleClicked(QModelIndex) {
    moveContent();
}

// -------------------------------------------------------

void PanelVideos::on_pushButtonPlay_clicked() {
    if (!m_isOutput) {
        m_isOutput = true;
        m_player->setVideoOutput(ui->widgetVideo);
    }
    m_player->play();
    ui->pushButtonPause->setEnabled(true);
    ui->pushButtonStop->setEnabled(true);
}

// -------------------------------------------------------

void PanelVideos::on_pushButtonStop_clicked() {
    m_player->stop();
    ui->pushButtonPause->setEnabled(false);
    ui->pushButtonStop->setEnabled(false);
}

// -------------------------------------------------------

void PanelVideos::on_pushButtonPause_clicked() {
    m_player->pause();
    ui->pushButtonPause->setEnabled(false);
}

// -------------------------------------------------------

void PanelVideos::on_pushButtonDLC_clicked()
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

void PanelVideos::on_pushButtonExport_clicked()
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
