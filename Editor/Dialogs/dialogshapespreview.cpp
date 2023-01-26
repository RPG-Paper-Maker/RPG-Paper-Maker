/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMimeData>
#include "dialogshapespreview.h"
#include "ui_dialogshapespreview.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogShapesPreview::DialogShapesPreview(SuperListItem *shapeID,
    CustomShapeKind kind, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogShapesPreview),
    m_kind(kind),
    m_shapeID(shapeID),
    m_initialShapeID(shapeID->id())
{
    ui->setupUi(this);
    ui->widget->setShapeKind(kind);
    ui->widget->changeShape(shapeID);
    ui->widget->showAvailableContent(RPM::get()->engineSettings()
        ->showAvailableContent());

    connect(this, SIGNAL(accepted()), this, SLOT(on_accepted()));
    connect(this, SIGNAL(rejected()), this, SLOT(on_rejected()));
    this->setAcceptDrops(true);
    this->translate();
}

DialogShapesPreview::~DialogShapesPreview()
{
    delete ui;
}

//-------------------------------------------------

void DialogShapesPreview::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SELECT_SHAPE) + RPM
        ::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogShapesPreview::dragEnterEvent(QDragEnterEvent *event)
{
    if (event->mimeData()->hasUrls()) {
        event->acceptProposedAction();
    }
}

// -------------------------------------------------------

void DialogShapesPreview::dropEvent(QDropEvent *event)
{
    QList<QUrl> urls = event->mimeData()->urls();
    QStringList list;
    for (int i = 0, l = urls.size(); i < l; i++)
    {
        list << urls.at(i).toLocalFile();
    }
    ui->widget->dropFiles(list);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogShapesPreview::closeEvent(QCloseEvent *) {
    this->on_rejected();
}

// -------------------------------------------------------

void DialogShapesPreview::on_accepted() {
    RPM::get()->project()->writePicturesDatas();
}

// -------------------------------------------------------

void DialogShapesPreview::on_rejected() {
    RPM::get()->project()->readPicturesDatas();

    // Update new picture adress
    SuperListItem *super = SuperListItem::getById(RPM::get()->project()
        ->shapesDatas()->model(m_kind)->invisibleRootItem(), m_initialShapeID);
    m_shapeID->setId(super->id());
    m_shapeID->setName(super->name());
}
