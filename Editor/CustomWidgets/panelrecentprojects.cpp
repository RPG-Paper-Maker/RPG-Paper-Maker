/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QPainter>
#include "panelrecentprojects.h"
#include "rpm.h"

const int PanelRecentProjects::RECT_HEIGHT = 60;
const int PanelRecentProjects::RECT_X = 10;
const int PanelRecentProjects::RECT_Y = 100;
const int PanelRecentProjects::RECT_Y_TITLE = 30;
const int PanelRecentProjects::RECT_OFFSET_Y_NAME = 23;
const int PanelRecentProjects::RECT_OFFSET_Y_LINK = 43;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelRecentProjects::PanelRecentProjects(QWidget *parent) :
    QWidget(parent),
    m_indexSelectedProject(-1)
{
    this->setMouseTracking(true);

    this->initialize();

    this->translate();
}

PanelRecentProjects::~PanelRecentProjects() {

}

// -------------------------------------------------------

void PanelRecentProjects::initialize() {
    m_staticTitle.setTextFormat(Qt::RichText);
}

// -------------------------------------------------------

bool PanelRecentProjects::isMouseSelecting(const QPoint &pos) {
    QRect rectAll(RECT_X, RECT_Y, this->width(), RPM::get()->engineSettings()
        ->projectNumber() * RECT_HEIGHT);
    bool isContaining;

    isContaining = rectAll.contains(pos);
    m_indexSelectedProject = isContaining ? (pos.y() - rectAll.y()) /
        RECT_HEIGHT : -1;

    return isContaining;
}

//-------------------------------------------------

void PanelRecentProjects::translate()
{
    m_staticTitle.setText("<h2>" + RPM::translate(Translations::RECENT_PROJECTS)
        + ":</h2>");
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void PanelRecentProjects::leaveEvent(QEvent *) {
    m_indexSelectedProject = -1;
    repaint();
}

// -------------------------------------------------------

void PanelRecentProjects::mousePressEvent(QMouseEvent *) {
    if (m_indexSelectedProject >= 0 && m_indexSelectedProject < RPM::get()
        ->engineSettings()->projectNumber())
    {
        emit openingProject(RPM::get()->engineSettings()->projectAtLink(
            m_indexSelectedProject));
    }
}

// -------------------------------------------------------

void PanelRecentProjects::mouseMoveEvent(QMouseEvent *event) {
    if (isMouseSelecting(event->pos())) {
        this->setCursor(Qt::PointingHandCursor);
    } else {
        this->setCursor(Qt::ArrowCursor);
    }
    repaint();
}

// -------------------------------------------------------

void PanelRecentProjects::paintEvent(QPaintEvent *) {
    QPainter painter(this);
    ThemeKind themeKind;
    bool isSelected;
    int i, x, y, w, h;
    QFont font;

    themeKind = RPM::get()->engineSettings()->theme();
    x = RECT_X;
    w = this->width();
    h = RECT_HEIGHT;
    m_staticTitle.setTextWidth(this->width());
    painter.drawStaticText(x, RECT_Y_TITLE, m_staticTitle);
    painter.setFont(font);

    // Draw all projects
    for (i = 0; i < RPM::get()->engineSettings()->projectNumber(); i++) {
        isSelected = i == m_indexSelectedProject;
        y = RECT_Y + (i * RECT_HEIGHT);
        if (isSelected) {
            painter.fillRect(x, y, w, h, themeKind == ThemeKind::Dark ? RPM
                ::COLOR_GRAY_SELECTION_DARKER : RPM::COLOR_GRAY_SELECTION_LIGHTER);
            font.setUnderline(true);
            painter.setFont(font);
        }
        painter.setPen(RPM::COLOR_MENU_SELECTION_BLUE);
        painter.drawText(x * 2, y + RECT_OFFSET_Y_NAME, RPM::get()
            ->engineSettings()->projectAtName(i));
        painter.setPen(RPM::COLOR_GREY);
        font.setUnderline(false);
        painter.setFont(font);
        painter.drawText(x * 2, y + RECT_OFFSET_Y_LINK, RPM::get()
            ->engineSettings()->projectAtLink(i));
    }

    // Draw empty information message
    if (RPM::get()->engineSettings()->projectNumber() == 0) {
        painter.setPen(themeKind == ThemeKind::Dark ? RPM::COLOR_GREY : RPM
            ::COLOR_ALMOST_BLACK);
        painter.drawText(x * 2, RECT_Y + RECT_OFFSET_Y_NAME, RPM::translate(
            Translations::NO_RECENT_PROJECTS_OPENED));
    }
}
