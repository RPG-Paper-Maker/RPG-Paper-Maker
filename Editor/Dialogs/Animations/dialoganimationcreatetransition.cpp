/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialoganimationcreatetransition.h"
#include "ui_dialoganimationcreatetransition.h"
#include "systemanimationframe.h"
#include "systemprogressiontable.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogAnimationCreateTransition::DialogAnimationCreateTransition(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogAnimationCreateTransition)
{
    ui->setupUi(this);

    this->translate();
}

DialogAnimationCreateTransition::~DialogAnimationCreateTransition()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogAnimationCreateTransition::createTransition(SystemAnimation
    *animation)
{
    QList<SystemAnimationFrameElement *> elements, elementsTransition;
    SystemAnimationFrame *frame, *frameTransition;
    SystemAnimationFrameElement *element, *elementTransition;
    int i, j, k, m, l, ll, fromFrame, toFrame, fromIndex, toIndex, equation, x,
        y, startX, startY, newX, newY, duration, posX, texRow, texCol;
    double zoom, angle, opacity, startZoom, startAngle, startOpacity, newZoom,
        newAngle, newOpacity;
    bool isX, isY, isZoom, isAngle, isOpacity, isVertical;

    // Get values from widgets
    fromFrame = ui->spinBoxFromFrames->value();
    toFrame = ui->spinBoxToFrames->value();
    fromIndex = ui->spinBoxFromIndex->value();
    toIndex = ui->spinBoxToIndex->value();
    equation = ui->widgetSliderProgression->equation();
    isX = ui->checkBoxX->isChecked();
    x = ui->spinBoxX->value();
    isY = ui->checkBoxY->isChecked();
    y = ui->spinBoxY->value();
    isZoom = ui->checkBoxZoom->isChecked();
    zoom = ui->doubleSpinBoxZoom->value();
    isAngle = ui->checkBoxAngle->isChecked();
    angle = ui->doubleSpinBoxAngle->value();
    isOpacity = ui->checkBoxOpacity->isChecked();
    opacity = ui->doubleSpinBoxOpacity->value();

    // Get progression for every element in the first frame
    duration = toFrame - fromFrame;
    frame = reinterpret_cast<SystemAnimationFrame *>(SuperListItem::getById(
        animation->framesModel()->invisibleRootItem(), fromFrame, false));
    for (i = fromIndex; i <= toIndex; i++) {
        elements = frame->getAllElementsWithID(i);

        // Get every index in the first frame
        for (j = 0, l = elements.size(); j < l; j++) {
            element = elements.at(j);
            startX = element->x();
            startY = element->y();
            startZoom = element->zoom();
            startAngle = element->angle();
            startOpacity = element->opacity();
            texRow = element->texRow();
            texCol = element->texColumn();
            isVertical = element->flipVerticaly();

            // Make transition on every other frames
            for (k = fromFrame + 1; k <= toFrame; k++) {
                posX = k - fromFrame;
                newX = SystemProgressionTable::easing(equation, posX, startX, x
                    - startX, duration);
                newY = SystemProgressionTable::easing(equation, posX, startY, y
                    - startY, duration);
                newZoom = SystemProgressionTable::easingDouble(equation, posX,
                    startZoom, zoom - startZoom, duration);
                newAngle = SystemProgressionTable::easingDouble(equation, posX,
                    startAngle, angle - startAngle, duration);
                newOpacity = SystemProgressionTable::easingDouble(equation, posX
                    , startOpacity, opacity - startOpacity, duration);
                frameTransition = reinterpret_cast<SystemAnimationFrame *>(
                    SuperListItem::getById(animation->framesModel()
                    ->invisibleRootItem(), k, false));
                elementsTransition = frameTransition->getAllElementsWithID(i);
                if (elementsTransition.isEmpty()) {
                    elementTransition = new SystemAnimationFrameElement(i, "",
                        startX, startY, texRow, texCol, startZoom, startAngle,
                        isVertical, startOpacity);
                    elementsTransition.append(elementTransition);
                    frameTransition->addElement(elementTransition);
                }
                for (m = 0, ll = elementsTransition.size(); m < ll; m++) {
                    elementTransition = elementsTransition.at(m);
                    elementTransition->setTexRow(texRow);
                    elementTransition->setTexColumn(texCol);
                    if (isX) {
                        elementTransition->setX(newX);
                    }
                    if (isY) {
                        elementTransition->setY(newY);
                    }
                    if (isZoom) {
                        elementTransition->setZoom(newZoom);
                    }
                    if (isAngle) {
                        elementTransition->setAngle(newAngle);
                    }
                    if (isOpacity) {
                        elementTransition->setOpacity(newOpacity);
                    }
                }
            }
        }
    }
}

//-------------------------------------------------

void DialogAnimationCreateTransition::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CREATE_TRANSITION) + RPM
        ::DOT_DOT_DOT);
    ui->labelTo->setText(RPM::translate(Translations::TO) + RPM::COLON);
    ui->labelFrom->setText(RPM::translate(Translations::FROM) + RPM::COLON);
    ui->labelToIndex->setText(RPM::translate(Translations::TO) + RPM::COLON);
    ui->labelFromIndex->setText(RPM::translate(Translations::FROM) + RPM::COLON);
    ui->groupBoxFrames->setTitle(RPM::translate(Translations::FRAMES) + RPM
        ::COLON);
    ui->groupBoxElementsIndex->setTitle(RPM::translate(Translations
        ::ELEMENTS_INDEX));
    ui->checkBoxX->setText(RPM::translate(Translations::X) + RPM::COLON);
    ui->checkBoxY->setText(RPM::translate(Translations::Y) + RPM::COLON);
    ui->checkBoxZoom->setText(RPM::translate(Translations::ZOOM) + RPM::COLON);
    ui->checkBoxAngle->setText(RPM::translate(Translations::ANGLE) + RPM::COLON);
    ui->checkBoxOpacity->setText(RPM::translate(Translations::OPACITY) + RPM
        ::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
