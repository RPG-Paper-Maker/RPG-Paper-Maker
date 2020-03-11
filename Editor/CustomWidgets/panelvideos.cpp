/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    ui->checkBoxContent->setText("Show available content of " + SystemVideo
        ::getLocalFolder());

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
    loadContentFromFolder(SystemVideo::getFolder(false), false);
    loadContentFromFolder(SystemVideo::getFolder(true), true);

    // Reselect index
    if (row != -1 && row != -2) {
        QModelIndex index = ui->treeViewAvailableContent->getModel()->index(row,
            0);
        ui->treeViewAvailableContent->setCurrentIndex(index);
    }
}

// -------------------------------------------------------

void PanelVideos::loadContentFromFolder(QString path, bool isBR) {
    QDir dir(path);
    QStringList files = dir.entryList(QDir::Files);
    QIcon icon = isBR ? QIcon(SuperListItem::pathIconBlue) : QIcon(
        SuperListItem::pathIconRed);
    QStandardItem *item;
    SystemSong *super;

    for (int i = 0; i < files.size(); i++) {
        super = new SystemSong(1, files.at(i), isBR);
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
        QMessageBox::warning(this, "Warning", "Could not delete file at " + path);
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

void PanelVideos::translate()
{

}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelVideos::showAvailableContent(bool b) {
    ui->checkBoxContent->setChecked(b);
    ui->treeViewAvailableContent->setVisible(b);
    ui->pushButtonMove->setVisible(b);
    ui->pushButtonRefresh->setVisible(b);
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

void PanelVideos::on_pushButtonAdd_clicked() {

    // Open dialog box
    QStringList files = QFileDialog::getOpenFileNames(this, "Add new contents",
        "", "Videos (*.mp4 *.ogv, *.avi)");
    QString path;

    // Copy all the selected files
    for (int i = 0; i < files.size(); i++) {
        path = files.at(i);
        if (!QFile::copy(path, Common::pathCombine(SystemVideo::getFolder(false)
            , QFileInfo(path).fileName())))
        {
            QMessageBox::warning(this, "Warning", "Could not copy file at " +
                path);
        }
    }

    // Refresh content
    loadAvailableContent();
}

// -------------------------------------------------------

void PanelVideos::deletingContent(SuperListItem *super, int row) {
    QString path = reinterpret_cast<SystemVideo *>(super)->getPath();

    // If is BR, ask if sure action before
    if (reinterpret_cast<SystemSong *>(super)->isBR()) {
        loadAvailableContent(row);
        QMessageBox::StandardButton box = QMessageBox::question(this,
            "Deleting song", "You are trying to remove a BR song. Are you sure "
            "you want to do it?", QMessageBox::Yes | QMessageBox::No);

        if (box == QMessageBox::Yes) {
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
