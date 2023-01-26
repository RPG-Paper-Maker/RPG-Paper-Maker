/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMimeData>
#include "dialogsongs.h"
#include "ui_dialogsongs.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSongs::DialogSongs(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSongs)
{
    ui->setupUi(this);
    
    ui->widgetSongs->setAreNegIDsEnabled(false);
    ui->widgetSongs->initializePrimitives(nullptr, nullptr);
    ui->widgetSongs->showAvailableContent(RPM::get()->engineSettings()
        ->showAvailableContent());

    // Tree model
    ui->treeView->setModel(createFoldersModel());
    ui->treeView->expandAll();
    connect(ui->treeView->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)),
            this,
            SLOT(on_folderSelected(QModelIndex,QModelIndex)));

    // Keep space when hiding widget
    QSizePolicy sp_retain;
    sp_retain = ui->widgetSongs->sizePolicy();
    sp_retain.setRetainSizeWhenHidden(true);
    ui->widgetSongs->setSizePolicy(sp_retain);
    this->setAcceptDrops(true);
    this->translate();
}

DialogSongs::~DialogSongs()
{
    delete ui->treeView->model();
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QStandardItemModel* DialogSongs::createFoldersModel() const{
    QStandardItemModel* model = new QStandardItemModel;
    QStandardItem* itemSongs;
    QIcon icon(":/icons/Ressources/dir.png");
    QList<QString> listNames;
    QList<SongKind> listEnums;

    // Pictures
    itemSongs = new QStandardItem;
    itemSongs->setData(QVariant::fromValue(
                      reinterpret_cast<SongKind>(SongKind::None)));
    itemSongs->setIcon(icon);
    itemSongs->setText("Songs");
    model->appendRow(itemSongs);

    // HUD
    listNames << "Musics" << "BackgroundSounds" << "Sounds" << "MusicEffects";
    listEnums << SongKind::Music << SongKind::BackgroundSound << SongKind::Sound
              << SongKind::MusicEffect;
    addfolders(icon, itemSongs, listNames, listEnums);

    return model;
}

// -------------------------------------------------------

void DialogSongs::addfolders(QIcon &icon,
                                QStandardItem* root,
                                QList<QString> &names,
                                QList<SongKind> &enums) const
{
    QStandardItem* item;

    for (int i = 0; i < names.size(); i++){
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<SongKind>(enums.at(i))));
        item->setIcon(icon);
        item->setText(names.at(i));
        root->appendRow(item);
    }
}

//-------------------------------------------------

void DialogSongs::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SONGS_MANAGER) + RPM
        ::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogSongs::dragEnterEvent(QDragEnterEvent *event)
{
    if (event->mimeData()->hasUrls()) {
        event->acceptProposedAction();
    }
}

// -------------------------------------------------------

void DialogSongs::dropEvent(QDropEvent *event)
{
    QList<QUrl> urls = event->mimeData()->urls();
    QStringList list;
    for (int i = 0, l = urls.size(); i < l; i++)
    {
        list << urls.at(i).toLocalFile();
    }
    ui->widgetSongs->dropFiles(list);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSongs::on_folderSelected(const QModelIndex& current,
                                    const QModelIndex&)
{
    QStandardItemModel* model = (QStandardItemModel*) ui->treeView->model();
    QStandardItem* item = model->itemFromIndex(current);
    SongKind k = item->data().value<SongKind>();
    ui->widgetSongs->setSongKind(k);
}
